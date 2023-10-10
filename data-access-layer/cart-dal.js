const { Cart_Item, Cart_Counter } = require('../models');
const { knex } = require('../bookshelf');

const assignCartNumber = async () => {
    
    console.log('cart number dal hit')

    const cartNumberFetch = await Cart_Counter.collection().fetch({
        'require': true
    });
    console.log("Fetched from cart table", cartNumberFetch)

    const cartTarget = cartNumberFetch.at(0)
    const cartNumber = cartTarget.get('id');
    
    console.log('cartNumber', cartNumber)

    const newCartNumber = cartNumber + 1;
    console.log('new cartNumber', newCartNumber)

    try{
        await knex('cart_counting').where({'id': cartNumber}).update({'id': newCartNumber})
        console.log('assign cart number success')
    } catch (error){
        console.log('fail to save cartCounter')
    }

    return cartNumber;
}

const retrieveAllCarts = async () => {
    try{
        const allCarts = await Cart_Item.collection().fetch({
            'require': false
        })
        return allCarts;
    } catch (error) {
        console.error('failed to retrieve all carts', error);
    }
}

const retrieveSingleCartItems = async (cartId) => {

    try{
        let cartItems = await Cart_Item.collection().where({'cart_id': cartId}).fetch({
            'require':false
        })  
        return cartItems;
    } catch (error){
        console.error('error retrieving cart items', error)
    }
}

const deleteCart = async (cartId) => {
    try{
        const userCart = await retrieveSingleCartItems(cartId);
        await userCart.destroy();
    } catch (error) {
        console.error('fail to delete user cart', error)
    }
}

const fetchCartItemByUserAndProduct = async (userId, cartId, productId) => {
    try{
        const foundCartItem = await Cart_Item.where({
            'user_id': userId,
            'cart_id': cartId,
            'product_id': productId
        }).fetch({
            require: false
        })
        return foundCartItem;
    } catch (error){
        console.error('error fetching cart item by id and product', error)
    }
}

const updateCartItemQuantity = async (payload) => {

    console.log('update Cart item qty from adding item hit, payload=>', payload)
    try{
        let userId = payload.user_id;
        let cartId = payload.cart_id;
        let productId = payload.product_id;
        let updatedQuantity = payload.quantity

        await knex('cart_items').where({'cart_id': cartId,
        'product_id': productId, 'user_id': userId}).update({'quantity': updatedQuantity})
    
    } catch (error){
        console.error('Failed to update qty', error)
    }
}

const createNewCartItem = async (payload) => {

    console.log('create new cart item dal here. Payload=>', payload)

    const currentDate = new Date();
    
    try{
        const newCartItem = new Cart_Item()
        newCartItem.set('cart_id', payload.cart_id);
        newCartItem.set('user_id', payload.user_id);
        newCartItem.set('product_id', payload.product_id);
        newCartItem.set('product_name', payload.product_name);
        newCartItem.set('price', payload.price);
        newCartItem.set('quantity', payload.quantity);
        newCartItem.set('date_time', currentDate);
        newCartItem.set('thumbnail_url', payload.thumbnail_url);

        await newCartItem.save();

    } catch (error) {
        console.error('error creating cart item', error)
    }
}

const removeEntryFromCart = async (userId, cartId, productId) => {
    try{
        const cartItemForDeletion = await fetchCartItemByUserAndProduct(userId, cartId, productId);
        console.log(cartItemForDeletion)
        await cartItemForDeletion.destroy();
    } catch (error) {
        console.error('failed to delete cart item', error)
    }
}

const removeEntireCart = async (cartId) => {
    try{
        const cartForDeletion = await retrieveSingleCartItems(cartId);
        await cartForDeletion.destroy();
    } catch (error) {
        console.error('failed to delete cart item', error)
    }
}

module.exports = {
                    assignCartNumber,
                    retrieveAllCarts,
                    deleteCart,
                    createNewCartItem, 
                    fetchCartItemByUserAndProduct, 
                    updateCartItemQuantity, 
                    removeEntryFromCart,
                    retrieveSingleCartItems,
                    removeEntireCart
}
