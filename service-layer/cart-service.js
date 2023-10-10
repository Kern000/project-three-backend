const cartDataAccess = require('../data-access-layer/cart-dal');

const retrieveAllCarts = async () => {
    await cartDataAccess.retrieveAllCarts();
}

const retrieveUserCartItems = async (cartId) => {
    const cartItems = await cartDataAccess.retrieveSingleCartItems(cartId);
    return cartItems;
}

const deleteCart = async (cartId) => {
    await cartDataAccess.deleteCart(cartId);
}

const cartCounter = async () => {
    let cartNumber = await cartDataAccess.assignCartNumber();
    return cartNumber;
}


const addToCart = async (payload) => {

    const cartItem = await cartDataAccess.fetchCartItemByUserAndProduct(payload.user_id, payload.cart_id, payload.product_id);

    if (cartItem){
        const updatedQuantity = cartItem.get('quantity')+1;
        const newPayload = payload
        newPayload.quantity = updatedQuantity
        await cartDataAccess.updateCartItemQuantity(newPayload)

    } else {
        console.log('alternate path hit at service layer addToCart')
        return await cartDataAccess.createNewCartItem(payload)
    }
}

const updateCartItemQuantity = async (payload) => {
    await cartDataAccess.updateCartItemQuantity(payload);
}



const removeEntryFromCart = async (userId, cartId, productId) => {
    await cartDataAccess.removeEntryFromCart(userId, cartId, productId);
}

module.exports =    {
                        cartCounter,
                        retrieveAllCarts,
                        retrieveUserCartItems,
                        deleteCart,
                        addToCart,
                        updateCartItemQuantity,
                        removeEntryFromCart
                    }
