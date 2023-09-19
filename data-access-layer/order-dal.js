const { Order_Item }= require('../models');

const retrieveAllOrders = async () => {
    try{
        const allOrders = await Order_Item.collection().fetch({
            'require': false,
            'withRelated': ['cart_item',
                            'product',
                            'product.post_category',
                            'product.genres',
                            {
                            'product.user': (queryBuild) => {
                                queryBuild.select('id', 'name')
                            }
            }]
        })
        return allOrders;
    } catch (error) {
        console.error('failed to retrieve all orders', error);
    }
}

const retrieveOrderByOrderId = async (orderId) => {
    try{
        const userOrder = await Order_Item.collection()
                        .where({'id': orderId})
                        .fetch({
                            'require': false,
                            'withRelated': ['cart_item',
                                            'product',
                                            'product.post_category',
                                            'product.genres',
                                            {
                                            'product.user': (queryBuild) => {
                                                queryBuild.select('id', 'name')
                                            }
                            }]
                        })
        return userOrder;
    } catch (error){
        console.error('error retrieving user orders', error)
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

const retrieveOrderItemByUserAndProduct = async (userId, productId) => {
    try{
        const foundOrderItem = await Order_Item.where({
            'user_id': userId,
            'product_id': productId
        }).fetch({
            require: false
        })
        return foundOrderItem;
    } catch (error){
        console.error('error fetching order item by id and product', error)
    }
}

const createNewOrderItem = async (userId, productId, quantity) => {
    try{
        const newOrderItem = new Order_Item({
            'user_id': userId,
            'product_id': productId,
            'quantity': quantity
        })
        await newOrderItem.save();
        return newOrderItem;
    } catch {
        console.error('error creating order item', error)
    }
}

const updateOrderItemQuantity = async (orderItem = null, userId = null, productId = null, updatedQuantity = null) => {
    try{
        if(!orderItem){
            orderItem = await retrieveOrderItemByUserAndProduct(userId, productId);
        }

        if (orderItem){
            orderItem.set('quantity', updatedQuantity);
            await orderItem.save();
        }
    } catch (error){
        console.error('Failed to update order item qty', error)
    }
}

const removeOrderItem = async (userId, posterId) => {
    try{
        const orderItemForDeletion = await retrieveOrderItemByUserAndProduct(userId, posterId);
        console.log('Item deleted', orderItemForDeletion)
        await orderItemForDeletion.destroy();
    } catch (error) {
        console.error('failed to delete order item', error)
    }
}

module.exports =    {
                        retrieveAllOrders,
                        retrieveOrderByOrderId,
                        deleteOrder,
                        retrieveOrderItemByUserAndProduct,
                        createNewOrderItem,
                        updateOrderItemQuantity,
                        removeOrderItem
                    }
