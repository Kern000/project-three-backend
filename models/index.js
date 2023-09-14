const bookshelf = require('../bookshelf');

const Product = bookshelf.model('Product',{
    tableName: 'products',

    post_category(){
        return this.belongsTo('Post_Category')
    },

    genres(){
        return this.belongsToMany('Genre')
    },

    user(){
        return this.belongsTo('User')
    },

    cart_item(){
        return this.belongsTo('Cart_Item')
    }
})

const Post_Category = bookshelf.model('Post_Category',{

    tableName: 'post_categories',

    products(){
        return this.hasMany('Product')
    }
})

const Genre = bookshelf.model('Genre',{
    tableName: 'genres',
    
    products(){
        return this.belongsToMany('Product')
    }
})

const User = bookshelf.model('User',{
    tableName: 'users',

    products(){
        return this.hasMany('Product')
    },

    cart_items(){
        return this.hasMany('Cart_Item')
    },

    order_items(){
        return this.hasMany('Order_Item')
    }
})

const Cart_Item = bookshelf.model('Cart_Item',{
    tableName: 'cart_items',

    product(){
        return this.belongsTo('Product')
    },

    order_item(){
        return this.belongsTo('Order_Item')
    },

    user(){
        return this.belongsTo('User')
    }
})

const Order_Item = bookshelf.model('Order_Item',{
    tableName: 'order_items',

    cart_item(){
        return this.belongsTo('Cart_Item')
    },

    user(){
        return this.belongsTo('User')
    }
})


module.exports = {  
                    Product, 
                    Post_Category, 
                    Genre, 
                    User, 
                    Cart_Item, 
                    Order_Item 
                }
