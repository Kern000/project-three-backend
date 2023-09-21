const { knex } = require('../bookshelf');
const { Order_Item }= require('../models');

const assignOrderNumber = async () => {
    
    const orderNumber = await Order_Counter.fetch({
        'require': true
    });

    const newOrderNumber = orderNumber.get('id') + 1;

    await Order_Counter.where({id:orderNumber}).save({ id: newOrderNumber });

    return orderNumber;
}

const assignOrderDateTime = async () => {

    timeOfOrder = new Date();

    return timeOfOrder;
}


const retrieveAllOrders = async () => {
    try{
        const allOrders = await Order_Item.collection().fetch({
            'require': false        
        })
        return allOrders;
    } catch (error) {
        console.error('failed to retrieve all orders', error);
    }
}

const retrieveOrderByUserId = async (userId) => {
    try{
        const userOrder = await Order_Item.collection()
                        .where({'user_id': userId})
                        .fetch({
                            'require': false,
                        })
        return userOrder;
    } catch (error){
        console.error('error retrieving user orders', error)
    }
}


const retrieveOrderByOrderId = async (orderId) => {
    try{
        const userOrder = await Order_Item.collection().where({'order_id': orderId})
                        .fetch({
                            'require': false,
                        })
        return userOrder;
    } catch (error){
        console.error('error retrieving user order by Id', error)
    }
}

const deleteOrder = async (orderId) => {
    try{
        const userOrder = await retrieveOrderByOrderId(orderId);
        await userOrder.destroy();
    } catch (error){
        console.error('failed to delete order', error);
    }
}

const retrieveOrderItemByUserAndProduct = async (userId, orderId, productId) => {
    try{
        const foundOrderItem = await Order_Item.collection().where({
            'user_id': userId,
            'order_id': orderId,
            'product_id': productId
        }).fetch({
            require: false
        })
        return foundOrderItem;
    } catch (error){
        console.error('error fetching order item by user id, order id, and product id', error)
    }
}



const retrieveOrderItemByOrderIdAndProduct = async (orderId, productId) => {
    try{
        const foundOrderItem = await Order_Item.collection().where({
            'order_id': orderId,
            'product_id': productId
        }).fetch({
            require: false
        })
        return foundOrderItem;
    } catch (error){
        console.error('error fetching order item by order id and product', error)
    }
}

const updateOrderItemQuantity = async (orderId = null, productId = null, updatedQuantity = null) => {
    try{


        let orderItem = await retrieveOrderItemByOrderIdAndProduct(orderId, productId);

        if (orderItem){

            await knex('order_items').where({'order_id': orderId,
            'product_id': productId}).update({'quantity': updatedQuantity})

            return await retrieveOrderItemByOrderIdAndProduct(orderId, productId);
        }
    } catch (error){
        console.error('Failed to update order item qty', error)
    }
}

const updateOrderFulfilment = async (orderId = null, productId = null, updatedStatus = null) => {
    try{

        let orderItem = await retrieveOrderItemByOrderIdAndProduct(orderId, productId);
        let newStatus;

        updatedStatus === 'Yes'? newStatus = 'No': newStatus = 'Yes'

        console.log('newStatus', newStatus)
        
        if (orderItem){

            await knex('order_items').where({'order_id': orderId,
            'product_id': productId}).update({'fulfilled': newStatus})

            orderItem = await retrieveOrderItemByOrderIdAndProduct(orderId, productId);
            console.log('should be updated', orderItem.toJSON())
            return orderItem;
        }
    } catch (error){
        console.error('Failed to update fulfilment', error)
    }
}

const removeOrderItem = async (orderId, productId) => {
    try{
        const orderItemForDeletion = await retrieveOrderItemByOrderIdAndProduct(orderId, productId);
        console.log('Item pending deletion', orderItemForDeletion)

        await knex('order_items').where({'order_id': orderId,
        'product_id': productId}).del()

    } catch (error) {
        console.error('failed to delete order item', error)
    }
}

module.exports =    {
                        assignOrderDateTime,
                        assignOrderNumber,
                        retrieveAllOrders,
                        retrieveOrderByUserId,
                        retrieveOrderByOrderId,
                        deleteOrder,
                        retrieveOrderItemByUserAndProduct,
                        retrieveOrderItemByOrderIdAndProduct,
                        updateOrderItemQuantity,
                        updateOrderFulfilment,
                        removeOrderItem
                    }
