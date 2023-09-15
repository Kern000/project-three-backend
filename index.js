const express = require("express");
const cors = require("cors");
require("dotenv").config();

// For super admin pages only
const hbs = require("hbs");
const wax = require("wax-on");
const flash = require('connect-flash');

const session = require('express-session');
const FileStore = require('session-file-store'); //store session on server

// Import non-global middlewares
const {
        checkSessionAuthentication,
        checkAuthenticationWithJWT,
        checkSessionPreference,
        createCSRFWithExceptions,
        sessionExpiryRouting
} = require('../middleware');

// Initialize Express
let app = express();

// For super admin handlebar template pages only
app.set("view engine", "hbs")
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layout")

// ## Global Middlewares ##

// Enable cross origin resource sharing
app.use(cors());

// Enable forms in req
app.use(
    express.urlencoded({        //when method attribute set to post, enctype set to 'application/x-www-form-urlencoded', make the data available in req.body
        extended: false         //will not parse nested
    })
)

// create sessions on global route
app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

// flash message for handlebar pages
app.use(flash());

// Attach csrf token for templates usage
app.use(function(req,res,next){
    if(req.csrfToken){
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

// flash messages for template usage only
app.use(function(req,res,next){
    const successMessages = req.flash("success");
    const errorMessages = req.flash("error");
    res.locals.success_messages = successMessages;
    res.locals.error_messages = errorMessages;
    next();
  })

// Enable user info for template
app.use(function(req, res, next){
    if (req.session.user){
      res.locals.user = req.session.user;
    }
    next();
})

// Import routes and logics, define higher level route category

//

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Server started, listening at port ", port)
})