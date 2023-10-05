const express = require('express');
const router = express.Router();
const cartService = require('../service-layer/cart-service');
const { checkUserAuthenticationWithJWT } = require('../middleware');

router.get('/', async(req,res)=>{
    const itemsInCart = await cartService.retrieveUserCartItems(req.session.user.id);
    return res.json({"itemsInCart": itemsInCart.toJSON()})
})

router.get('/assign-cart-number', [checkUserAuthenticationWithJWT], async(req,res)=>{
    try {
        let cartNumber = await cartService.cartCounter();
        res.status(200).json({"cartNumber": cartNumber});
    } catch (error){
        res.status(400).send('Fail to retrieve cart number')
    }
})

// router.post('/:product_id/add', async(req,res)=>{

//     const addItem = await cartService.addToCart(
//         req.session.user.id,
//         req.params.product_id,
//         1
//     );
//     res.json({"message": "Item added to cart"});
// })

// router.post('/:product_id/update-qty', async(req,res)=>{
    
//     const newQuantity = req.body.newQuantity;
//     await cartService.updateCartItemQuantity(
//         req.session.user.id,
//         req.params.product_id,
//         newQuantity
//     )
//     res.status(201);
//     res.json({"message": "Item added to cart"})
// })

router.post('/:product_id/delete', async(req,res)=>{
    await cartService.removeEntryFromCart(
        req.session.user.id,
        req.params.product_id
    )
    res.status(202);
    res.json({"message": "Item removed from cart"})
})

module.exports = router;






