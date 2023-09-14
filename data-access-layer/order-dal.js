const { Order_Item }= require('../models');

const fetchAllOrders = async (userId) => {
    let orders = await Order_Item.collection()
                    .where({'user_id': userId})
                    .fetch({
                        'require': false,
                        'withRelated': ['cart_item', 
                                        'cart_item.product', 
                                        'cart_item.product.post_category', 
                                        'cart_item.product.genres', 
                                        {
                                        'cart_item.product.user': (queryBuild) => {
                                            queryBuild.select('id', 'name')
                                        }
                                    }
                        ]
                    })
}

module.exports = fetchAllOrders;