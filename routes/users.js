const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const {findProductsByUserId} = require('../service-layer/products-service')

const {
    checkUserAuthenticationWithJWT,
    checkUserSessionAuthentication
} = require('../middleware');

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

router.post('/try/login', async(req, res)=>{
 
    console.log('post login route hit')
   
    console.log('requestbody here', req.body)

    try {
        let foundUser = await User.where({
            email: req.body.email,
            password: req.body.password
        }).fetch({
            require: false
        });

        console.log("this has been found", foundUser.toJSON())

        let userId = foundUser.get('id');
        let userName = foundUser.get('name');

        console.log('userId route =>', userId)
        console.log('userName route =>', userName)

        if (foundUser){
            const accessToken = generateJWT(foundUser.toJSON(), process.env.ACCESS_TOKEN_SECRET, "1hr");
            const refreshToken = generateJWT(foundUser.toJSON(), process.env.REFRESH_TOKEN_SECRET, "7d");
            
            req.session.user = {
                id: foundUser.get('id'),
                name: foundUser.get('name'),
                email: foundUser.get('email'),
                ipAddress: req.ip,
                date: new Date(),
            }

            res.json({
                accessToken, refreshToken, id: userId, name: userName
            })
        } else {
            res.sendStatus(403)
        }
    } catch (error){
        console.error('error in fetching with model', error)
    }
})

router.get('/dashboard/:userId', async(req, res)=>{

    let userProducts = await findProductsByUserId()

    res.json({"products":userProducts.toJSON()})

})

router.post('/register', async(req, res)=>{

    let foundUser = await User.where({
        'email': req.body.email,
        'password': getHashedPassword(req.body.password)
        }).fetch({
            require: false
        });

    if (foundUser){
        res.status(400).json({"error": "Email already in use"});
    } else {

        const newUser = new User();

        newUser.set({
            name: req.body.name,
            email: req.body.email,
            password: getHashedPassword(req.body.password)
        })
        await newUser.save();

        const accessToken = generateJWT(foundUser.toJSON(), process.env.ACCESS_TOKEN_SECRET, "4w");
        const refreshToken = generateJWT(foundUser.toJSON(), process.env.REFRESH_TOKEN_SECRET, "12w");
        
        res.json({accessToken, refreshToken})
    }
})

module.exports = router;





