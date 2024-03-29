const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const {
    checkSessionAuthentication,
    checkAuthenticationWithJWT,
} = require('../middleware');

router.get('/', [checkSessionAuthentication, checkAuthenticationWithJWT], async(req,res)=>{
    console.log('landing get route hit, this is headers', req.headers);

    let products = await Product.collection().fetch({
        withRelated:['post_category', 'genres']
    });
    res.json({'products': products.toJSON()})
})

module.exports = router;
