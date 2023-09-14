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

    cart_items(){
        return this.belongsToMany('Cart_Item')
    }

})
