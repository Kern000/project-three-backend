const jwt = require('jsonwebtoken');
const csurf = require('csurf');
const csrfInstance = csurf();

const checkSessionAuthentication = (req, res, next) => {
    if (req.session.user){
        next();
    } else {
    res.status(401);
    return res.send('User must be logged in to view page');
    }
}

const checkSessionPreference = (req, res, next) => {
    if (req.session.preference){
        req.userPreference = req.session.preference;
    }
    next();
}

const checkAuthenticationWithJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(error, payload){
            if(error){
                res.status(401);
                return res.json({
                    error
                })
            } else {
                req.user = payload;
                next();
            }
        })
    } else {
        res.status(401);
        res.send('User must be logged in to view page')
    }
}

const createCSRFWithExceptions = (req, res, next) => {
    if (req.url === "/checkout/process-payment") {
        return next();
    }
    csrfInstance(req.res.next);
}

// have to come after session, csrf
const sessionExpiryRouting = (req, res, next) => {
    if(error && error.code == "EBADCSRFTOKEN"){
        res.send("Session expired, login again");
        // frontend will have rerout logic
    } else {
        next();
    }
}



module.exports =    {
                        checkSessionAuthentication,
                        checkAuthenticationWithJWT,
                        checkSessionPreference,
                        createCSRFWithExceptions,
                        sessionExpiryRouting
                    }
