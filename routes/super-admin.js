const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Super_Admin, BlackListedToken, Session } = require('../models');

const { bootstrapField, createLoginForm, createRegisterForm } = require('../forms'); 
const { checkSessionAuthentication } = require('../middleware');

const generateJWT = (superAdmin, tokenSecret, expirationTime) => {
    return jwt.sign({
        'name': superAdmin.name,
        'id': superAdmin.id,
        'email': superAdmin.email
    }, tokenSecret, {expiresIn: expirationTime}
    )
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hashedPassword = sha256.update(password).digest('base64')
    return hashedPassword;
}

router.get("/register", (req, res)=>{
    const form = createRegisterForm();
    res.render('user/register',{
        adminForm: form.toHTML(bootstrapField)
    })
})

router.post("/register", (req, res)=>{
    const adminUserForm = createRegisterForm();
    adminUserForm.handle(req, {
            success: async (form) => {
                const superAdmin = new Super_Admin();
                superAdmin.set({
                    name: form.data.name,
                    email: form.data.email,
                    password: getHashedPassword(form.data.password)
                })
                await superAdmin.save();
                req.flash("success", "Successful registration")
                res.redirect('/admin/login')
            },
            error: async (form) =>{
                res.render('admin/register', {
                    adminForm: form.toHTML(bootstrapField)
                })
            },
            empty: async (form) =>{
                res.render('admin/register', {
                    adminForm: form.toHTML(bootstrapField)
                })
            }        
    })
})

router.get('/login', (req, res) => {
    const form = createLoginForm();
    res.render('admin/login',{
        adminForm: form.toHTML(bootstrapField)
    })
})


router.post('/login', async(req, res)=>{

    const form = createLoginForm();

    form.handle(req, {
        'success': async (form) => {
            let foundSuperAdmin = await Super_Admin.where({
                'email': req.body.email,
                'password': getHashedPassword(req.body.password)
            }).fetch({
                require: false
            });

            if (foundSuperAdmin){

                const accessToken = generateJWT(foundSuperAdmin.toJSON(), process.env.ACCESS_TOKEN_SECRET, "1hr");
                const refreshToken = generateJWT(foundSuperAdmin.toJSON(), process.env.REFRESH_TOKEN_SECRET, "7d");

                req.session.user = {
                    id: foundSuperAdmin.get('id'),
                    name: foundSuperAdmin.get('name'),
                    email: foundSuperAdmin.get('email'),
                    ipAddress: req.ip,
                    date: new Date()
                }

                const sessionLog = new Session();
                sessionLog.set('session', (req.session.user).toJSON())

                try{
                    await sessionLog.save()

                    req.flash('success', 'Login Successful')

                    res.json({
                        accessToken, refreshToken
                    })
    
                    res.redirect('/admin/dashboard')
    
                } catch (error){
                    console.error('fail to save session log', error)
                }
            } else {
                req.flash('error', 'Invalid Login');
                res.status(403);
                res.redirect('/admin/login');
            }
    }
    })
})

router.post('/refreshAccess', (req,res)=>{

    const refreshToken = req.body.refresh;

    if(!refreshToken){
        return res.sendStatus(400)
    } else {

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(error, payload)=>{
            if (error){
                return res.sendStatus(400);
            }

            try{
                const blackListedToken = await BlackListedToken.where({
                    "token": refreshToken
                }).fetch({
                    require:false
                })

                if (blackListedToken){
                    res.status(400);
                    return res.json({
                        "error": "Token is black listed"
                    })
                } else {
                    const accessToken = generateJWT(payload, process.env.ACCESS_TOKEN_SECRET, "1hr")
                    res.json({
                        accessToken
                    })
                }
            } catch (error){
                console.error('failed to fetch blacklisted token', error)
            }
        })
    }
})

router.delete('/blackList', async(req,res)=>{

    jwt.verify(req.query.refreshToken, process.env.REFRESH_TOKEN_SECRET, (error,payload)=>{

        if (error){
            return res.sendStatus(400);
        } else {
            const blackListedToken = new BlackListedToken({
                token: req.query.refreshToken,
                date_of_blacklist: new Date()
            })
            blackListedToken.save();
            res.json({
                "success": "Token blacklisted"
            })
        }
    })
})

router.get('/logout', [checkSessionAuthentication], (req,res)=>{
    req.session.user = null;
    req.flash('success', 'See you soon')
    res.redirect('/admin/login')
})

module.exports = router;