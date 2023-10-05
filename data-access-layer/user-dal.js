const { default: knex } = require('knex');
const { User, Product, Genres_Products } = require('../models');

const retrieveAllUsers = async () => {
    console.log('retrieve all users hit')
    try{
        return await User.fetchAll({
            withRelated: ['order_items', 'products']
        });
    } catch (error) {
        console.error('error retrieving all Users', error)
    }
}

const findUserById = async (userId) => {
    console.log('findUserById dal hit');
    try{
        const userFoundById = await User.where({
            'id': userId
        }).fetch({
            require:true,
            withRelated: ['order_items', 'products']
        })
        return userFoundById;
    } catch (error){
        console.error('error finding user by Id', error)
    }
}

const addUserProductListing = async (payload) => {

    console.log('route hit for addUserProduct')

    try{
        const product = new Product();
        product.set('name', payload.name);
        product.set('price', payload.price);
        product.set('description', payload.description);
        product.set('image_url', payload.imageUrl);
        product.set('thumbnail_url', payload.thumbnailUrl);
        product.set('date_created', new Date());
        product.set('stock', payload.stock);
        product.set('post_category_id', payload.postCategoryId)
        product.set('chapter_content', payload.chapterContent)
        product.set('user_id', payload.userId)

        const productId = payload.userId
        const genreIds = payload.genreId;

        const insertData = genreIds.map(genreId => ({
            "product_id": parseInt(productId),
            "genre_id": parseInt(genreId)
        })
        )

        console.log('insertData here', insertData)
        
        try{
            await product.save();
            console.log('success save product', product.toJSON())
            try{
                await product.genres().attach(insertData);
                console.log('success saving genres')
            } catch (error) {
                console.log('Fail to save genres', error)
            }
        } catch (error) {
            console.log('failed to attach genres', error)
        }

    } catch (error) {
        console.error('error adding product listing', error)
    }
}


module.exports = {retrieveAllUsers,findUserById, addUserProductListing};

