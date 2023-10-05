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
    },

    order_item(){
        return this.belongsTo('Order_Item')
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
})

const Order_Item = bookshelf.model('Order_Item',{
    tableName: 'order_items'
})

const Super_Admin = bookshelf.model('Super_Admin', {
    tableName: 'super_admin',

    sessions(){
        return this.hasMany('Session')
    }
})

const Genres_Products = bookshelf.model('Genres_Products',{
    tableName:'genres_products'
})

const BlackListedToken = bookshelf.model("BlackListedToken", {
    tableName: 'blacklisted_tokens'
})

const Session = bookshelf.model("Session",{
    tableName: 'sessions',

    Super_Admin(){
        return this.belongsTo('Super_Admin')
    }
})

const Cart_Counter = bookshelf.model("Cart_Counter",{
    tableName: 'cart_counting'
})

const Order_Counter = bookshelf.model("Order_Counter",{
    tableName: 'order_counting'
})

module.exports = {  
                    Product, 
                    Post_Category, 
                    Genre, 
                    User, 
                    Cart_Item, 
                    Order_Item,
                    Super_Admin,
                    BlackListedToken,
                    Session,
                    Cart_Counter,
                    Order_Counter,
                    Genres_Products
                }
