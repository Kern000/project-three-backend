const { Product, Post_Category, Genre } = require('../models');

const retrieveAllProducts = async () => {
    try{
        return await Product.fetchAll({
            withRelated: [  'post_category', 
                            'genres', 
                            {
                            'user': (queryBuild) => {
                                queryBuild.select('id', 'name')
                                }
                            }
            ]
        });

    } catch (error) {
        console.error('error retrieving all products', error)
    }
}

const retrieveAllPostCategories = async () => {
    try{
        const allPostCategories = await Post_Category.fetchAll()
                                    .map(category=> [category.get('id'), category.get('category')])
        return allPostCategories;

    } catch (error){
        console.error('error retrieving post_categories', error)
    }
}

const retrieveAllGenres = async () => {
    try{
        const allGenres = await Genre.fetchAll()
                            .map(genre=>[genre.get('id'), genre.get('genre')])
        return allGenres;

    } catch (error){
        console.error('error retrieving genres', error)
    }
}

const findProductById = async (productId) => {
    try{
        const productFoundById = await Product.where({
            'id': productId
        }).fetch({
            require:true,
            withRelated: [  'post_category', 
                            'genres',
                            {
                            'user': (queryBuild) => {
                                queryBuild.select('id', 'name')
                                }
                            }
            ]
        })
        return productFoundById;

    } catch (error){
        console.error('error finding product by Id', error)
    }
}

const findProductsByUser = async (userName) => {
    
    try{
        const productsFoundByUser = await Product
            .innerJoin('users', 'products.user_id', 'users.id')
            .whereILike('user.name', `%${userName}`)
            .fetchAll({
                withRelated: [  'post_category', 
                                'genres', 
                                {
                                'user': (queryBuild) => {
                                    queryBuild.select('id', 'name')
                                    }
                                }
                ]
            })
        return productsFoundByUser;

    } catch (error){
        console.error('error finding product by Id', error)
    }
}

const addProductListing = async (productForm) => {

    try{
        const product = new Product();
        product.set('name', productForm.data.name);
        product.set('price', productForm.data.price);
        product.set('description', productForm.data.description);
        product.set('image_url', productForm.data.image_url);
        product.set('thumbnail_url', productForm.data.thumbnail_url);
        product.set('date_created', Date.now())
        product.set('stock', productForm.data.stock);
        product.set('chapter_content', productForm.data.chapter_content)
        product.set('quantity_sold', productForm.data.quantity_sold)

        await product.save();
        return product;
    
    } catch (error) {
        console.error('error adding product listing', error)
    }
}

module.exports= {
                    retrieveAllProducts,
                    retrieveAllPostCategories,
                    retrieveAllGenres,
                    findProductById,
                    findProductsByUser,
                    addProductListing
                }