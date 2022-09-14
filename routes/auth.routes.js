const Express = require('express');
const router = Express.Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middleware');


router.get('/signup', isNotAuthenticated, (req,res,next) => {
    res.render('signup')
})

router.post('/signup', (req,res,next) => {
    const myUsername = req.body.username;
    const myPassword = req.body.password;

    const myHashedPass = bcryptjs.hashSync(myPassword);

    User.create({
        username: myUsername,
        password: myHashedPass
    })
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            res.send(err)
        })
})

router.get('/login', isNotAuthenticated, (req,res,next) => {
    res.render('login')
})

router.post('/login', (req,res,next) => {
    console.log(req.body)

    const myUsername = req.body.username;
    const myPassword = req.body.password;

    User.findOne({
        username: myUsername
    })
        .then(foundUser => {
            console.log(foundUser);

            if(!foundUser){
                res.send('no user matching this username')
            }

            const isValidPassword = bcryptjs.compareSync(myPassword,foundUser.password)

            if(!isValidPassword){
                res.send('incorrect password')
            }
            req.session.user = foundUser;

            res.redirect('/main');
        })
        .catch(err => res.send(err))
})

router.get('/main', isAuthenticated, (req,res,next) => {
    if(req.session.user){
        res.render('main')
    } else {
        res.redirect('/login')
    }
})

router.get('/private', isAuthenticated, (req,res,next) => {
    if(req.session.user){
        res.render('private')
    } else {
        res.redirect('/login')
    }
})

module.exports = router;