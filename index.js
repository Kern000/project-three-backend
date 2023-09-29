const express = require("express");
const cors = require("cors");
require("dotenv").config();

// For super admin pages only
const hbs = require("hbs");
const wax = require("wax-on");
const flash = require('connect-flash');

const session = require('express-session');
const FileStore = require('session-file-store')(session); //store session on server

// for csrf protection
const csurf = require('csurf');

// Initialize Express
let app = express();

// For super admin handlebar template pages only
app.set("view engine", "hbs")
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layout")

// ## Global Middlewares ##

// Enable cross origin resource sharing

app.use(cors());

app.use(express.json());

// Enable forms in req
app.use('/admin', express.urlencoded({ extended: false }));

// create sessions on global route
app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

// flash message for handlebar pages
app.use(flash());

const csrfInstance = csurf();

app.use(function(req, res, next) {
    if (req.url === "/checkout/process-payment") {
        return next();
    }
    
    else if (req.url.startsWith('/admin')){
        console.log('admin csrf hit')
        csrfInstance(req, res, next);
    } else {

    console.log('csrf with exception hit')
    next()
    }
})


app.use(function(error, req, res, next){
    console.log('session expiry routing hit');

    if(error && error.code == "EBADCSRFTOKEN"){
        req.flash("error", "Session expired, login and try again");
        res.redirect('/');
    } else {
        next();
    }
})

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
    if (req.session.superAdmin){
        res.locals.superAdmin = req.session.superAdmin
    }
    if (req.session.user){
      res.locals.user = req.session.user;
    }
    next();
})

// Logics

// app.get('/get-csrf', (req,res) => {
//     req.session.csrf = req.csrfToken();
//     console.log("session here", req.session.csrf)
//     res.json({"csrf":req.session.csrf})
// })

// Import routes and logics, define higher level route category

//
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const superAdminRoutes = require('./routes/super-admin');
const cloudinaryRoutes = require('./routes/cloudinary');
const checkoutRoutes = require('./routes/checkout');
const cartRoutes = require('./routes/cart');

async function main(){

    app.use('/admin', superAdminRoutes);

    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/users', userRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', checkoutRoutes);
}

main();

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Server started, listening at port ", port)
})