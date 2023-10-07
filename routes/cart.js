const express = require('express');
const router = express.Router();
const cartService = require('../service-layer/cart-service');
const { checkUserAuthenticationWithJWT } = require('../middleware');

router.get('/', [checkUserAuthenticationWithJWT], async(req,res)=>{

    console.log('route hit for user cart get')

    let userId = parseInt(req.query.userId);
    let cartId = req.query.cartId;
    console.log('userId here', userId);
    console.log('cartId here', cartId);
    console.log('user Id here', req.user.id);

    if (req.user.id === userId){
        console.log('user passed cart jwt authorization');     
        const itemsInCart = await cartService.retrieveUserCartItems(userId, cartId);

        if (itemsInCart.length>0){
            res.status(201).json({"itemsInCart": itemsInCart.toJSON()});
        } else {
            res.status(200).json({"itemsInCart": ''})
        }
    } else {
        res.status(401).send("Unauthorized, log in to view page");
    }
})

router.get('/assign-cart-number', [checkUserAuthenticationWithJWT], async(req,res)=>{

    console.log('assign cart number route hit')
    
    try {
        let cartNumber = await cartService.cartCounter();
        res.status(200).json({"cartNumber": cartNumber});
    } catch (error){
        res.status(400).send('Fail to retrieve cart number')
    }
})

router.post('/:product_id/add', [checkUserAuthenticationWithJWT], async(req,res)=>{

    console.log('cart add item route hit')
    let userId = parseInt(req.query.userId);
    let payload = req.body;

    if (req.user.id === userId){
        console.log('add cart item route authorization passed')
    
        const addItem = await cartService.addToCart(
        {
            user_id: userId,
            cart_id: payload.cart_id,
            product_id: payload.product_id,
            product_name: payload.product_name,
            price: payload.price,
            quantity: 1,
            thumbnail_url: payload.thumbnail_url
        })
        res.status(201).send("Item added");
    } else {
        res.status(401).send('Log in to add to cart')
    }
})

router.post('/deleteItem', [checkUserAuthenticationWithJWT], async(req,res)=>{

    console.log('delete entry route hit')

    const userId = parseInt(req.query.userId);
    const cartId = parseInt(req.query.cartId);
    const productId = parseInt(req.query.productId)

    if (req.user.id === userId){
        try{
            await cartService.removeEntryFromCart(userId, cartId, productId);
            res.status(204).send("Delete successful")
        } catch (error){
            res.status(400).send('fail to delete entry')
        }
    } else {
        res.status(401).send("login to try again");
    }
})

router.post('/update-qty', [checkUserAuthenticationWithJWT], async(req,res)=>{

    console.log('update route hit')

    const userId = parseInt(req.query.userId);
    const cartId = parseInt(req.query.cartId);
    const productId = parseInt(req.query.productId)

    if (req.user.id === userId){

        console.log('front end payload has reached update cart route', req.body)

        let payload = {
            user_id: userId,
            cart_id: cartId,
            product_id: productId,
            quantity: parseInt(req.body.quantity)
        }

        console.log('payload for update here', payload)

        try{
            await cartService.updateCartItemQuantity(payload)
            res.status(202).send('update quantity success')
        } catch(error) {
            res.status(400).send('Fail to update')
        }

    } else {
        res.status(401).send('user not authorized')
    }
})


module.exports = router;






