const express = require('express');
const router = express.Router();

const cartService = require('../service-layer/cart-service');
const { default: Stripe } = require('stripe');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// make payment on checkout

router.get("/", async(req,res)=>{
    console.log("checkout route hit");

    const cartBeingCheckedOut = await cartService.retrieveUserCartItems(req.session.user.id) 
    const lineItems = [];

    for (let cartItem of cartBeingCheckedOut){
        const lineItem = {
            "quantity": cartItem.get("quantity"),
            "price_data": {
                "currency": "SGD",
                "unit_amount": cartItem.related('product').get('price'),
                "product_data": {
                    "name": cartItem.related('product').get('name'),
                    "metadata": {
                        "product_id": cartItem.get("product_id")
                    }
                }
            }
        }
        if (cartItem.related('product').get('thumbnail_url')){
            lineItem.price_data.product_data.images = [cartItem.related('product').get('thumbnail_url')]
        }

        lineItems.push(lineItem);

    }

    const payment = {
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: "",
        cancel_url:""
    }

    const stripeSession = await Stripe.checkout.sessions.create(payment);

    res.status(201);
    res.json({"payment_url": stripeSession.url})
})


// Receive Payment

router.post('/receive', express.raw({type:'application/json'}), async(req,res)=>{
    console.log('receive payment route hit');

    const payload= req.body;
    const endPointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    const signatureHeader = req.headers['stripe-signature'];

    let event;

    try{
        event = Stripe.Webhooks.constructEvent(payload, signatureHeader, endPointSecret);
        res.json({"received": true})
    } catch (error){
        res.json({"error": error.message})
        console.log(error.message)
    }

    if (event.type == "checkout.session.completed"){
        const stripeSession = event.data.object;
        console.log('stripe session success =>', stripeSession);
    }

})

module.exports = router;


