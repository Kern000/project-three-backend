const express = require('express');
const router = express.Router();
const { Product } = require('../models');

router.get('/', async(req,res)=>{
    console.log('landing get route hit');

    let products = await Product.collection().fetch({
        withRelated:['post_category', 'genres']
    });
    res.json({'products': products.toJSON()})
})

module.exports = router;
