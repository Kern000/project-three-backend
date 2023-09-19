const express = require('express');
const router = express.Router();

// Authentication
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// ORM relations
const { Super_Admin, Product, BlackListedToken, Session } = require('../models');

// Forms
const { bootstrapField, createLoginForm, createProductForm, createSearchForm, createRegisterForm } = require('../forms'); 

// DAL logics
const { retrieveAllProducts,
        retrieveAllPostCategories,
        retrieveAllGenres,
        findProductById,
        addProductListing } = require("../data-access-layer/products-dal");
const { retrieveAllUsers } = require("../data-access-layer/super-admin-dal");
const { retrieveAllOrders, retrieveOrderByOrderId } = require("../data-access-layer/order-dal");

router.get("/register", (req, res)=>{
    const form = createRegisterForm();
    res.render('admin/register',{
        adminForm: form.toHTML(bootstrapField)
    })
})

// Register route is purely for testing
router.post("/register", (req, res)=>{

    const adminUserForm = createRegisterForm();

    adminUserForm.handle(req, {
            success: async (form) => {

                try {
                    const superAdmin = new Super_Admin();

                    superAdmin.set({
                        name: form.data.name,
                        email: form.data.email,
                        password: getHashedPassword(form.data.password)
                    })
                    await superAdmin.save();
                    req.flash("success", "Successful registration");
                    res.redirect('/admin/login');

                } catch (error) {
                    console.error("fail to access database", error)
                }
            },
            error: async (form) =>{
                res.render('admin/register', {
                    adminForm: form.toHTML(bootstrapField)
                })
            },
            empty: async (form) =>{
                res.render('admin/register', {
                    adminForm: form.toHTML(bootstrapField)
                })
            }        
    })
})

router.get('/login', (req, res) => {
    const form = createLoginForm();
    res.render('admin/login',{
        adminForm: form.toHTML(bootstrapField)
    })
})

const generateJWT = (superAdmin, tokenSecret, expirationTime) => {
    return jwt.sign({
        'name': superAdmin.name,
        'id': superAdmin.id,
        'email': superAdmin.email
    }, tokenSecret, {expiresIn: expirationTime}
    )
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hashedPassword = sha256.update(password).digest('base64')
    return hashedPassword;
}

router.post('/login', async(req, res)=>{

    const form = createLoginForm();

    form.handle(req, {
        'success': async (form) => {
            let foundSuperAdmin = await Super_Admin.where({
                'email': req.body.email,
                'password': getHashedPassword(req.body.password)
            }).fetch({
                require: false
            });

            if (foundSuperAdmin){

                const accessToken = generateJWT(foundSuperAdmin.toJSON(), process.env.ACCESS_TOKEN_SECRET, "1hr");
                const refreshToken = generateJWT(foundSuperAdmin.toJSON(), process.env.REFRESH_TOKEN_SECRET, "14d");

                req.session.superUser = {
                    id: foundSuperAdmin.get('id'),
                    name: foundSuperAdmin.get('name'),
                    email: foundSuperAdmin.get('email'),
                    ipAddress: req.ip,
                    date: new Date(),
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }

                console.log(req.session.superUser)

                const superAdminId = foundSuperAdmin.get('id');

                try{

                    const session = new Session();
                    session.set('session', req.session.superUser);
                    session.set('super_admin_id', superAdminId)
                    await session.save()

                    res.redirect('/admin/products')
    
                } catch (error){
                    console.error('fail to save session log', error)
                }
            } else {
                req.flash('error', 'Invalid Login');
                res.status(403);
                res.redirect('/admin/login');
            }
    }
    })
})

router.get('/products', async(req,res)=>{

    let allPostCategories = await retrieveAllPostCategories();
    allPostCategories.unshift([0, '-------']);

    let allGenres = await retrieveAllGenres();
    allGenres.unshift([0, '-------']);

    const searchForm = createSearchForm(allPostCategories, allGenres);

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

            if (searchForm.data.min_price) {
                console.log('search form min price hit', searchForm.data.min_price)
                query.where('price', '>=', searchForm.data.min_price)
            }

            if (searchForm.data.max_price) {
                console.log('search form max price hit', searchForm.data.max_price)
                query.where('price', '<=', searchForm.data.max_price)
            }

            if (searchForm.data.post_category_id && searchForm.data.post_category_id != 0) {
                console.log('search form post category id hit =>', searchForm.data.post_category_id);

                query.where('post_category_id', '=', searchForm.data.post_category_id);
            }

            if (searchForm.data.genres && searchForm.data.genres != 0) {
                console.log('search form genres hit', searchForm.data.genres)

                query.query(qb => {
                    qb.join('genres_products', 'product_id', 'products.id');
                    qb.where('genre_id', 'in', searchForm.data.genres.split(','));
                });                
            }

            const products = await query.fetch({
                withRelated:['post_category', 'genres']
            })

            res.render('admin/products', {
                'products': products.toJSON(),
                'adminForm': searchForm.toHTML(bootstrapField)
            })
        },
        'empty': async (searchForm) => {

            const products = await query.fetch({
                withRelated:['post_category', 'genres']
            })

            res.render('admin/products',{
                'products': products.toJSON(),
                'adminForm': searchForm.toHTML(bootstrapField)
            })
        }
    })

})

router.get('/products/:productId/update', async(req,res)=>{
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

    res.render('admin/update', {
        'form': form.toHTML(bootstrapField),
        'product': product.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/products/:productId/update', async(req,res)=>{
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
            await product.genres().attach(form.data.genres.split(','));

            res.redirect('/admin/products')
         },
         "error": (form)=>{
            res.render('admin/update',{
                'form': form.toHTML(bootstrapField),
                'products': product.toJSON(),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
         },
         "empty": (form)=>{
            res.render('admin/update',{
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON(),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
         }
    })
})

router.get('/add-product', async (req,res)=>{
    const allPostCategories = await retrieveAllPostCategories();
    const allGenres = await retrieveAllGenres();

    const form = createProductForm(allPostCategories, allGenres);
    res.render('admin/create', {
        'form': form.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloundinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET    
    })
})

router.post('/add-product', async (req, res)=>{
    const allPostCategories = await retrieveAllPostCategories();
    const allGenres = await retrieveAllGenres();

    const form = createProductForm(allPostCategories, allGenres);

    form.handle(req, {
        "success": async (form) =>{
            let product = await addProductListing(form);

            console.log(product)
            if (form.data.genres){
                await product.genres().attach(form.data.genres.split(','));
            }
            req.flash("success", "New product created");
            res.redirect('/admin/products')
        },
        "error": (form) => {
            res.render('admin/create', {
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloundinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        "empty": (form) =>{
            res.render('admin/create', {
            'form': form.toHTML(bootstrapField),
            cloudinaryName: process.env.CLOUDINARY_NAME,
            cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
            cloundinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})

router.get('/products/:productId/delete', async (req,res)=>{
    let productId = req.params.productId;
    
    const product = await findProductById(productId);

    res.render('admin/delete', {
        'product': product.toJSON()
    })
})

router.post('/products/:productId/delete', async (req,res)=>{
    let productId = req.params.productId;
    const product =await findProductById(productId);

    await product.destroy();
    res.redirect('/admin/products');
})

router.get('/logout', (req,res)=>{
    req.session.user = null;
    req.flash('success', 'Log out successful! See you soon')
    res.redirect('/admin/login')
})

router.get('/users', async(req,res)=>{
    let users = await retrieveAllUsers();

    res.render('admin/users',{
        'users': users.toJSON()
    })
})

router.post('/:userId/delete', async (req,res)=>{
    let userId = req.params.userId;
    const user =await findUserById(userId);

    await user.destroy();
    res.redirect('/admin/users');
})



router.post('/refreshAccess', (req,res)=>{

    const refreshToken = req.body.refresh;

    if(!refreshToken){
        return res.sendStatus(400)
    } else {

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(error, payload)=>{
            if (error){
                return res.sendStatus(400);
            }
            try{
                const blackListedToken = await BlackListedToken.where({
                    "token": refreshToken
                }).fetch({
                    require:false
                })

                if (blackListedToken){
                    res.status(400);
                    return res.json({
                        "error": "Token is black listed"
                    })
                } else {
                    const accessToken = generateJWT(payload, process.env.ACCESS_TOKEN_SECRET, "1hr")
                    res.json({
                        accessToken
                    })
                }
            } catch (error){
                console.error('failed to fetch blacklisted token', error)
            }
        })
    }
})

router.delete('/blackList', async(req,res)=>{

    jwt.verify(req.query.refreshToken, process.env.REFRESH_TOKEN_SECRET, (error,payload)=>{

        if (error){
            return res.sendStatus(400);
        } else {
            const blackListedToken = new BlackListedToken({
                token: req.query.refreshToken,
                date_of_blacklist: new Date()
            })
            blackListedToken.save();
            res.json({
                "success": "Token blacklisted"
            })
        }
    })
})





router.get('/orders', async (req,res)=>{
    let orders = await retrieveAllOrders();
    res.render('admin/orders',{
        'orders': orders.toJSON()
    })
})

router.post('/orders/:orderId/delete', async(req,res)=>{
    let userId = req.params.orderId;
    const order = await retrieveOrderByOrderId(userId);

    await order.destroy();
    res.redirect('/admin/orders')
})

module.exports = router;