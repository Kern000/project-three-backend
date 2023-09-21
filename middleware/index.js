const jwt = require('jsonwebtoken');
const { BlackListedToken } = require('../models');

const checkSessionAuthentication = (req, res, next) => {

    console.log('check session authentication hit')
    if (req.session.superAdmin){
        console.log('session auth passed!')
        next();
    } else {
    res.status(401);
    return res.send('(Session) User must be logged in to view page');
    }
}

const checkAuthenticationWithJWT = (req, res, next) => {
    console.log('check Authentication with JWT hit')

    req.headers.authorization = req.session.superAdmin.accessToken;

    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if(authHeader){
        // const token = authHeader.split(" ")[1];
        const token = authHeader;

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(error, payload){
            
            if(error){
                
                if (error.message === "jwt expired"){

                    const refreshToken = req.session.superAdmin.refreshToken;
                    
                    if(!refreshToken){
                        return res.sendStatus(400)

                    } else {
                
                        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(error, payload)=>{
                            
                            console.log('jwt verify for refresh token payload', payload)
                            
                            if (error){
                                return res.sendStatus(400);
                            }
                            
                            try {
                                const blackListedToken = await BlackListedToken.where({
                                    "token": refreshToken
                                }).fetch({
                                    require:false
                                })
                
                                if (blackListedToken){
                                    res.status(400);
                                    return res.json({"error": "Token is black listed"})
                                
                                } else {

                                    console.log("access token generation route hit")

                                    const generateJWT = (payload, tokenSecret, expirationTime) => {
                                        return jwt.sign({
                                            'name': payload.name,
                                            'id': payload.id,
                                            'email': payload.email
                                        }, tokenSecret, {expiresIn: expirationTime}
                                        )
                                    }

                                    const accessToken = generateJWT(payload, process.env.ACCESS_TOKEN_SECRET, "1hr")

                                    console.log("JWT access token refreshed")
                                    req.session.superAdmin.accessToken = accessToken
                                    req.user = payload;
                                    next();
                                }
                            } catch (error){
                                console.error('failed to fetch blacklisted token', error)
                            }
                        })
                       }
                } else {
                    res.status(401);
                    return res.json({error})
                }
            } else {
                console.log('Login Access token successful')
                req.user = payload;
                next();
            }
        })
    } else {
        res.status(401);
        res.send('(JWT) User must be logged in to view page')
    }
}




module.exports =    {
                        checkSessionAuthentication,
                        checkAuthenticationWithJWT,

                    }
