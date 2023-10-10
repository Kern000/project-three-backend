const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const {findProductsByUserId, findProductById} = require('../service-layer/products-service');
const {retrieveOrderByUserId} = require('../service-layer/order-service');
const {retrieveUserCartItems} = require('../service-layer/cart-service');
const {postNewUserProduct, updateUserProduct} = require('../service-layer/user-service');

const { checkUserAuthenticationWithJWT } = require('../middleware');
const session = require('express-session');

const generateJWT = (user, tokenSecret, expirationTime) => {
    return jwt.sign({
        'name': user.name,
        'id': user.id,
        'email': user.email
    }, tokenSecret, {expiresIn: expirationTime}
    )
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hashedPassword = sha256.update(password).digest('base64')
    return hashedPassword;
}

router.post('/login', async(req, res)=>{

    try {
        let foundUser = await User.where({
            email: req.body.email,
            password: getHashedPassword(req.body.password)
        }).fetch({
            require: false
        });

        try {
            if (foundUser){

                let userId = foundUser.get('id');
                let userName = foundUser.get('name');
        
                console.log('userId route =>', userId)
                console.log('userName route =>', userName)
        
                const accessToken = generateJWT(foundUser.toJSON(), process.env.ACCESS_TOKEN_SECRET, "3hr");
                const refreshToken = generateJWT(foundUser.toJSON(), process.env.REFRESH_TOKEN_SECRET, "7d");
                
                req.session.user = {
                    id: foundUser.get('id'),
                    name: foundUser.get('name'),
                    email: foundUser.get('email'),
                    ipAddress: req.ip,
                    date: new Date(),
                }

                console.log('route here accessToken', accessToken)
                console.log('route here refreshToken', refreshToken)
                console.log('full session here', req.session)
                console.log('session here', req.session.user)

                res.json({
                    "accessToken": accessToken, "refreshToken": refreshToken, "userId": req.session.user.id, "userName": userName
                })
            } else {
                res.status(403).send("User not found")
            }
        } catch (error){
            console.error("Fail to sign JWT", error)
            res.status(500).send("authentication failed")
        }
    } catch (error){
        console.error("Unable to retrieve user", error)
        res.status(500).send("Internal server error")
    }
})

router.post('/register', async(req, res)=>{

    console.log('register route hit')
    let foundUser = await User.where({
    'email': req.body.email,
    'password': getHashedPassword(req.body.password)
    }).fetch({
        require: false
    });

    console.log('is there foundUser', foundUser)

    if (foundUser){
        res.status(400).send("Email already in use");    

    } else {
        const newUser = new User();
        console.log('creating new User')
        try {
            newUser.set({
                name: req.body.name,
                email: req.body.email,
                password: getHashedPassword(req.body.password),
                secret: req.body.secret
            })
            await newUser.save();
            res.sendStatus(202).send('registration success');
        } catch (error){
            res.status(500).send('server is down')
        }
    }
})

router.get('/dashboard/:userId', [checkUserAuthenticationWithJWT], async(req, res)=>{

    console.log('dashboard get route hit')
    console.log('req user id here', req.user.id)

    if (req.user.id == req.params.userId){

        console.log('passed user basic authorization')

        try{

            let userProducts = await findProductsByUserId(req.params.userId)

            if (userProducts.length > 0){

                res.json({"products":userProducts.toJSON()})

            } else {

                res.status(204).json({error: "No products found"})
            }

        } catch (error) {
            res.status(500).json({error: "Failed to fetch products"})
        }
    } else {
        res.status(401).json({error: 'unauthorized user'})
    }
})

router.post('/add-product/:userId', [checkUserAuthenticationWithJWT], async(req,res)=>{

    if (req.user.id == req.params.userId){

        try{
            console.log('Req.body is here', req.body)
            await postNewUserProduct(req.body);
            res.status(200).send('successfully added product')
        } catch (error) {
            res.status(400).send('Failed to post new product')            
        }
    } else {
        res.status(403).send('user not authorized for this action')
    }
})

router.get('/:productId/products', [checkUserAuthenticationWithJWT], async(req,res)=>{
   
    console.log("user single product route hit, req.query here =>", req.query.userId)
    console.log("req.user.id", req.user.id)

    let userId = parseInt(req.query.userId)

    if (req.user.id === userId){

        console.log('passed authorization check');

        const productId = req.params.productId
        console.log('product Id here =>', productId)

        try{
            let product = await findProductById(productId)

            res.json({'product': product.toJSON()});
        } catch (error){
            res.status(204).send("Error verifying user, please try again")
        }
    } else {
        res.status(401).send("User not authorized to view page")
    }
})

router.get('/update/:productId', [checkUserAuthenticationWithJWT], async(req,res)=>{

    console.log('update get route hit', req.query.userId, "req.user.id =>", req.user.id)

    let userId = parseInt(req.query.userId);

    if (req.user.id === userId){

        const productId = req.params.productId;

        try{
            const product = await findProductById(productId);
            res.json({"product": product.toJSON()})

        } catch (error){
            res.status(400).send('product not found')
        }
    } else {
        res.status(401).send('user not authorized to view')
    }
}
)

router.post('/:productId/update', [checkUserAuthenticationWithJWT], async(req,res)=>{

    console.log("user single update route hit, req.query here =>", req.query.userId)
    console.log("req.user.id at update", req.user.id)

    let userId = parseInt(req.query.userId)

    if (req.user.id === userId){
        let payload = req.body

        console.log('update route authorization achieved')
        try {
            await updateUserProduct(payload)
            console.log('successful update here')
        } catch (error){
            res.status(400).send('Bad request from user')
        }
        res.status(200).send("Product update success");
    } else {
        res.status(401).send('user not authorized to view page')
    }
})

router.post('/:productId/delete', [checkUserAuthenticationWithJWT], async(req,res)=>{

    console.log('delete route hit for user')

    let userId = parseInt(req.query.userId)

    if (req.user.id === userId){

        let productId = req.params.productId;

        try{
            console.log('user finding product for deletion')

            const product= await findProductById(productId);
            console.log('item to be deleted', product.toJSON());

            await product.destroy();
            console.log('item deleted');

            res.status(204).send("Item deleted, no regrets right?")
        } catch (error){
            res.status(400).send('fail to delete item')
        }
    } else {
        res.status(401).send('action not authorized')
    }
})

router.get('/check-login', [checkUserAuthenticationWithJWT], (req,res)=>{
    if (req.user){
        console.log('jwt has not expired')
        res.status(200).send('user is authenticated')
    } else {
        res.status(401).send('please login again')
    }
})



module.exports = router;





