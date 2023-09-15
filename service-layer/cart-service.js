const cartDataAccess = require('../data-access-layer/cart-dal');

const retrieveAllCarts = async () => {
    await cartDataAccess.retrieveAllCarts();
}

const retrieveUserCartItems = async (userId) => {
    await cartDataAccess.retrieveUserCartItems(userId);
}

const deleteCart = async (userId) => {
    await cartDataAccess.deleteCart(userId);
}

const addToCart = async (userId, productId, quantity) => {

    const cartItem = await cartDataAccess.fetchCartItemByUserAndProduct(userId, productId);

    if (cartItem){
        const updatedQuantity = cartItem.get('quantity')+1;
        await cartDataAccess.updateCartItemQuantity(cartItem, userId, productId, updatedQuantity)
    } else {
        return await cartDataAccess.createNewCartItem(userId, productId, quantity)
    }
}

const updateCartItemQuantity = async (userId, productId, updatedQuantity) => {
    await cartDataAccess.updateCartItemQuantity(cartItem=null, userId, productId, updatedQuantity);
}

const removeEntryFromCart = async (userId, productId) => {
    await cartDataAccess.removeEntryFromCart(userId, productId);
}

module.exports =    {
                        retrieveAllCarts,
                        retrieveUserCartItems,
                        deleteCart,
                        addToCart,
                        updateCartItemQuantity,
                        removeEntryFromCart
                    }
