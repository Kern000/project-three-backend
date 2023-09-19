const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

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
    
    let foundUser = await User.where({
        'email': req.body.email,
        'password': getHashedPassword(req.body.password)
    }).fetch({
        require: false
    });

    if (foundUser){
        const accessToken = generateJWT(foundUser.toJSON(), process.env.ACCESS_TOKEN_SECRET, "1hr");
        const refreshToken = generateJWT(foundUser.toJSON(), process.env.REFRESH_TOKEN_SECRET, "7d");
        
        req.session.user={
            id: foundUser.get('id'),
            name: foundUser.get('name'),
            email: foundUser.get('email')
        }
              
        res.json({
            accessToken, refreshToken
        })
    } else {
        res.sendStatus(403)
    }
})

router.get('/logout', (req,res)=>{
    req.session.user = null;
    res.json({"success":"successfully logged out"})
})



module.exports = router;





