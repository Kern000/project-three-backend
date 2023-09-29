const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const {findProductsByUserId} = require('../service-layer/products-service');
const {retrieveOrderByUserId} = require('../service-layer/order-service');
const {retrieveUserCartItems} = require('../service-layer/cart-service');

const {
    checkUserAuthenticationWithJWT
} = require('../middleware');
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

        console.log("this has been found", foundUser.toJSON())

        let userId = foundUser.get('id');
        let userName = foundUser.get('name');

        console.log('userId route =>', userId)
        console.log('userName route =>', userName)

        try {
            if (foundUser){
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

    try{
        let foundUser = await User.where({
            'email': req.body.email,
            'password': getHashedPassword(req.body.password)
            }).fetch({
                require: false
            });

        try{   
            if (foundUser){
                res.status(400).send("Email already in use");    
            } else {
                const newUser = new User();
                newUser.set({
                    name: req.body.name,
                    email: req.body.email,
                    password: getHashedPassword(req.body.password),
                    secret: req.body.secret
                })
                await newUser.save();       
                res.sendStatus(202);
            }
        } catch (error) {
            console.error('fail to register user to db', error)
            res.sendStatus(500)
        }
    } catch {
        console.error('Internal error', error);
        res.sendStatus(500)
    }
})

router.get('/dashboard/:userId', [checkUserAuthenticationWithJWT], async(req, res)=>{

    console.log('dashboard get route hit')
    console.log('req user id here', req.user.id)

    if (req.user.id == req.params.userId){

        console.log('passed user basic authorization // future to implement based on IAT')

        try{

            let userProducts = await findProductsByUserId(req.params.userId)

            console.log('route received the following from DAL', userProducts)

            if (userProducts.length > 0){

                res.json({"products":userProducts.toJSON()})

            } else {

                res.status(204).json({error: "No products found"})
            }

        } catch (error) {
            res.status(500).json({error: "Failed to fetch products"})
        }
    } else {
        res.status(403).json({error: 'unauthorized user'})
    }
})

module.exports = router;





