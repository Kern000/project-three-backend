const orderDataAccess = require('../data-access-layer/order-dal');

const assignOrderNumber = async()=>{
    const orderId = await orderDataAccess.assignOrderNumber();
    return orderId;
}

const retrieveAllOrders = async () => {
    await orderDataAccess.retrieveAllOrders();
}

const retrieveOrderByUserId = async (userId) => {
    await orderDataAccess.retrieveOrderByUserId(userId);
}

const deleteOrder = async (userId) => {
    await orderDataAccess.deleteOrder(userId);
}

const addToOrder = async (userId, productId, quantity) => {

    const orderItem = await orderDataAccess.retrieveOrderItemByUserAndProduct(userId, productId);

    if (orderItem){
        const updatedQuantity = orderItem.get('quantity')+1;
        await orderDataAccess.updateOrderItemQuantity(cartItem, userId, productId, updatedQuantity)
    } else {
        return await orderDataAccess.create(userId, productId, quantity)
    }
}

const updateOrderItemQuantity = async (userId, productId, updatedQuantity) => {
    await orderDataAccess.updateOrderItemQuantity(cartItem=null, userId, productId, updatedQuantity);
}

const removeOrderItem = async (userId, productId) => {
    await orderDataAccess.removeOrderItem(userId, productId);
}

const createNewOrder = async (payload) => {
    await orderDataAccess.createNewOrder(payload);
}

module.exports =    {
                        retrieveAllOrders,
                        retrieveOrderByUserId,
                        deleteOrder,
                        addToOrder,
                        updateOrderItemQuantity,
                        removeOrderItem,
                        assignOrderNumber,
                        createNewOrder
}

