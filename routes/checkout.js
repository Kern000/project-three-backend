const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')

const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); //for client side operation

// make payment on checkout

router.post("/", express.json(), async(req,res)=>{
    console.log("checkout route hit");

    const cartBeingCheckedOut = req.body
    console.log('checkout on cart (req.body)=>', req.body)

    const order_id = req.query.orderId
    console.log('order id has been fetch', order_id)

    const payment = {
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: cartBeingCheckedOut,
        success_url: "http://localhost:3000/paymentsuccess",
        client_reference_id: order_id
    }

    const stripeSession = await Stripe.checkout.sessions.create(payment);

    res.status(201).json({"paymentUrl": stripeSession.url})
})

router.post('/process-payment', bodyParser.raw({type: 'application/json'}), async(req, res)=>{

    let payload = req.body;
    let endPointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];

    console.log("received payment confirmation req.body here", payload)
    console.log("signatureHeader here", sigHeader)

    let event;

    try{
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endPointSecret);

        res.json({"received": true}) //send to stripe
    } catch (error){
        console.log(error.message);
        res.json({"error": error.message}); // send to stripe
    }

    if (event.type == "checkout.session.completed"){
        const stripeSession = event.data.object;
        console.log('stripe session success =>', stripeSession);
        let orderId = stripeSession.client_reference_id
        console.log('order id passing through stripe', orderId)

    }
})


module.exports = router;


