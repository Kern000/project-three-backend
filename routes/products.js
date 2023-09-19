const express = require('express');
const router = express.Router();
const { bootstrapField, createProductForm, createSearchForm } = require('../forms'); 
const { retrieveAllProducts,
        retrieveAllPostCategories,
        retrieveAllGenres,
        findProductById,
        addProductListing } = require("../data-access-layer/products-dal");

router.get('/', async(req,res)=>{

    let products = await retrieveAllProducts();

    res.json({'products': products.toJSON()})
})

router.get('/search', async(req,res)=>{

    let allPostCategories = await retrieveAllPostCategories();

    allPostCategories.unshift([0, '-------']);

    const allGenres = await retrieveAllGenres();

    const searchForm = createSearchForm(allPostCategories,allGenres);

    const query= Product.collection();

    searchForm.handle(req, {
        'success': async (searchForm) => {
            console.log('search route hit')

            if (searchForm.data.name) {
                console.log('search form name hit', searchForm.data.name)
                query.where('name', 'like', '%' + searchForm.data.name + '%')
            }

            if (searchForm.data.user) {
                console.log('search form user hit', searchForm.data.user)

                query.query(qb => {
                    qb.join('users', 'products.user_id', 'users.id');
                    qb.where('users.name', 'like', '%' + searchForm.data.user + '%');
                });                
            }

            if (searchForm.data.min_cost) {
                console.log('search form min cost hit', searchForm.data.min_cost)
                query.where('cost', '>=', searchForm.data.min_cost)
            }

            if (searchForm.data.max_cost) {
                console.log('search form max cost hit', searchForm.data.max_cost)
                query.where('cost', '<=', searchForm.data.max_cost)
            }

            if (searchForm.data.post_category_id && searchForm.data.post_category_id != 0) {
                console.log('search form post category id hit =>', searchForm.data.post_category_id);

                query.where('post_category_id', '=', searchForm.data.post_category_id);
            }

            if (searchForm.data.genres) {
                console.log('search form genres hit', searchForm.data.genres)

                query.query(qb => {
                    qb.join('genres_products', 'products_id', 'products.id');
                    qb.where('genre_id', 'in', searchForm.data.genres.split(','));
                });                
            }

            const products = await query.fetch({
                withRelated:['post_category', 'genres']
            })

            res.json({'products': products.toJSON()})
        },
        'empty': async (searchForm) => {

            const products = await query.fetch({
                withRelated:['post_category', 'genres']
            })

            res.json({'products': products.toJSON()})
        }
    })
})

router.get('/add-product', async (req,res)=>{
    const allPostCategories = await retrieveAllPostCategories();
    const allGenres = await retrieveAllGenres();

    const form = createProductForm(allPostCategories, allGenres);
    res.json({
        'form': form.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloundinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET    
    })
})

router.post('/add-poster', async (req, res)=>{
    const allPostCategories = await retrieveAllPostCategories();
    const allGenres = await retrieveAllGenres();

    const form = createProductForm(allPostCategories, allGenres);

    form.handle(req, {
        "success": async (form) =>{
            let product = await addProductListing(form);

            if (form.data.genres){
                await product.genres().attach(form.data.genres.split(','));
            }
            res.status(201);
            res.json({"success": "New product created"});
        },
        "error": (form) => {
            res.json({
                'form': form.toHTML(bootstrapField)
            })
        },
        "empty": (form) =>{
            res.json({
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:productId/update', async(req,res)=>{
    const productId = req.params.productId;
    const product = await findProductById(productId)

    const allPostCategories = await retrieveAllPostCategories();
    const allGenres = await retrieveAllGenres();

    const form = createProductForm(allPostCategories, allGenres);

    form.fields.name.value = await product.get('name');
    form.fields.price.value = await product.get('price');
    form.fields.description.value = await product.get('description');
    form.fields.post_category_id.value = await product.get('post_category_id');
    form.fields.image_url.value = await product.get('image_url');
    form.fields.thumbnail_url.value = await product.get('thumbnail_url');
    form.fields.chapter_content.value = await product.get('chapter_content');
    form.fields.stock.value = await product.get('stock');

    const selectedGenres = await product.related('genres').pluck('id');
    form.fields.genres.value = selectedGenres;

    res.json({
            'form': form.toHTML(bootstrapField),
            'product': product.toJSON(),
            cloudinaryName: process.env.CLOUDINARY_NAME,
            cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
            cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:productId/update', async(req,res)=>{
    const productId = req.params.productId;
    const product = await findProductById(productId);

    const allPostCategories = await retrieveAllPostCategories();
    const allGenres = await retrieveAllGenres();

    const form = createProductForm(allPostCategories, allGenres);

    form.handle(req, {
        "success" : async (form) =>{
            let {genres, ... productData} = form.data;
            product.set(productData);
            await product.save();

            const indicatedGenres = await product.related('genres').pluck('id');
            await product.genres().detach(indicatedGenres);
            await product.genres().attach(form.data.genres);

            res.status(200);
            res.json({"success": "update product success"});
         },
         "error": (form)=>{
            res.json({
                'form': form.toHTML(bootstrapField),
                'products': product.toJSON()
            })
         },
         "empty": (form)=>{
            res.json({
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
         }
    })
})

router.post('/:productId/delete', async (req,res)=>{
    let productId = req.params.productId;
    const product =await findProductById(productId);

    await product.destroy();
    res.json({"success":"item deleted"});
})


module.exports = router;