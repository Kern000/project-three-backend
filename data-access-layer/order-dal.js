const { knex } = require('../bookshelf');
const { Order_Item, Order_Counter }= require('../models');

const assignOrderNumber = async () => {
    
    console.log('order number dal hit')

    const orderNumberFetch = await Order_Counter.collection().fetch({
        'require': true
    });

    const orderTarget = orderNumberFetch.at(0)
    const orderNumber = orderTarget.get('id');
    
    console.log('orderNumber', orderNumber)

    const newOrderNumber = orderNumber + 1;
    console.log('new orderNumber', newOrderNumber)

    try{
        await knex('order_counting').where({'id': orderNumber}).update({'id': newOrderNumber})
        console.log('assign order number success')
    } catch (error){
        console.log('fail to save orderCounter')
    }

    return orderNumber;
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

const createNewOrder = async (payload) => {

    const currentDate = new Date();

    console.log('DAL payload from route', payload)

    try{
        for (let item of payload){
            let orderItem = new Order_Item();
            orderItem.set('order_id', item.order_id);
            orderItem.set('cart_id', item.cart_id);
            orderItem.set('user_id', item.user_id);
            orderItem.set('product_id', item.product_id);
            orderItem.set('product_name', item.product_name);
            orderItem.set('price', item.price);
            orderItem.set('quantity', item.quantity);
            orderItem.set('date_time', currentDate);
            orderItem.set('fulfilled', 'No');
            await orderItem.save()
        }
    } catch (error){
        console.log('Fail create new order entry at DAL', error)
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
                        assignOrderNumber,
                        retrieveAllOrders,
                        retrieveOrderByUserId,
                        retrieveOrderByOrderId,
                        deleteOrder,
                        retrieveOrderItemByUserAndProduct,
                        retrieveOrderItemByOrderIdAndProduct,
                        updateOrderItemQuantity,
                        updateOrderFulfilment,
                        removeOrderItem,
                        createNewOrder
                    }
