const { Cart_Item, Cart_Counter } = require('../models');

const assignCartNumber = async () => {
    
    const cartNumber = await Cart_Counter.fetch({
        'require': true
    });

    const newCartNumber = cartNumber.get('id') + 1;

    await Cart_Counter.where({id:cartNumber}).save({ id: newCartNumber });

    return cartNumber;
}



const assignCartDateTime = async () => {

    timeOfCart = new Date();

    return timeOfCart;
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

const retrieveUserCartItems = async (userId) => {

    try{
        let userCartItems = await Cart_Item.collection().where({'user_id': userId}).fetch({
            'require':false
        })                        
        return userCartItems;
    } catch (error){
        console.error('error retrieving cart items', error)
    }
}

const retrieveSingleCartItems = async (cartId) => {

    try{
        let CartItems = await Cart_Item.collection().where({'cart_id': cartId}).fetch({
            'require':false
        })                        
        return CartItems;
    } catch (error){
        console.error('error retrieving cart items', error)
    }
}

const deleteCart = async (userId) => {
    try{
        const userCart = await retrieveUserCartItems(userId);
        await userCart.destroy();
    } catch (error) {
        console.error('fail to delete user cart', error)
    }
}

const createNewCartItem = async (payload) => {
    try{

        const newCartItem = new Cart_Item({
            'cart_id': payload.cartId,
            'user_id': payload.userId,
            'product_id': payload.productId,
            'product_name': payload.productName,
            'price': payload.price,
            'quantity': payload.quantity,
            'date_time': Date.Now()
        })
        await newCartItem.save();
        return newCartItem;
    } catch {
        console.error('error creating cart item', error)
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

const updateCartItemQuantity = async (cartItem = null, userId = null, cartId = null, productId = null, updatedQuantity = null) => {
    try{
        if(!cartItem){
            cartItem = await fetchCartItemByUserAndProduct(userId, cartId, productId);
        }

        if (cartItem){
            cartItem.set('quantity', updatedQuantity);
            await cartItem.save();
        }
    } catch (error){
        console.error('Failed to update qty', error)
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
                    assignCartDateTime,
                    retrieveAllCarts,
                    retrieveUserCartItems,
                    deleteCart,
                    createNewCartItem, 
                    fetchCartItemByUserAndProduct, 
                    updateCartItemQuantity, 
                    removeEntryFromCart,
                    retrieveSingleCartItems,
                    removeEntireCart
}
