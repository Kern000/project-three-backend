const { Cart_Item } = require('../models');

const retrieveUserCartItems = async (userId) => {

    try{
        let userCartItems = await Cart_Item.collection()
                        .where({'user_id': userId})
                        .fetch({
                            'require': false,
                            'withRelated': ['product', 
                                            'product.post_category', 
                                            'product.genres', 
                                            {
                                            'product.user': (queryBuild) => {
                                                queryBuild.select('id', 'name')
                                            }
                            }]
                        })

        return userCartItems;
    } catch (error){
        console.error('error retrieving cart items', error)
    }
}

const createNewCartItem = async (userId, productId, quantity) => {
    try{
        const newCartItem = new Cart_Item({
            'user_id': userId,
            'product_id': productId,
            'quantity': quantity
        })
        await newCartItem.save();
        return newCartItem;
    } catch {
        console.error('error creating cart item', error)
    }
}

const fetchCartItemByUserAndProduct = async (userId, productId) => {
    try{
        const foundCartItem = await Cart_Item.where({
            'user_id': userId,
            'product_id': productId
        }).fetch({
            require: false
        })
        return foundCartItem;
    } catch (error){
        console.error('error fetching cart item by id and product', error)
    }
}

const updateCartItemQuantity = async (cartItem = null, userId = null, productId = null, updatedQuantity = null) => {
    try{
        if(!cartItem){
            cartItem = await fetchCartItemByUserAndProduct(userId, posterId);
        }

        if (cartItem){
            cartItem.set('quantity', updatedQuantity);
            await cartItem.save();
        }
    } catch (error){
        console.error('Failed to update qty', error)
    }
}

const removeEntryFromCart = async (userId, posterId) => {
    try{
        const cartItemForDeletion = await fetchCartItemByUserAndProduct(userId, posterId);
        console.log(cartItemForDeletion)
        await cartItemForDeletion.destroy();
    } catch (error) {
        console.error('failed to delete cart item', error)
    }
}

module.exports = {
                    retrieveUserCartItems, 
                    createNewCartItem, 
                    fetchCartItemByUserAndProduct, 
                    updateCartItemQuantity, 
                    removeEntryFromCart
}