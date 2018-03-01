var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
//signup route
router.get('/signup',function(req,res,next) {
    var messages = req.flash('error');
    res.render('signup',{title:'Sign Up', csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/signup',passport.authenticate('local.signup',{
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if(req.session.oldUrl){
        var oldUrl =req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }else{
        res.redirect('/user/signin');
    }
});

//user singin
router.get('/signin',function(req,res,next){
    var messages = req.flash('error');
    res.render('login',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0});
});

router.post('/signin',passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if(req.session.oldUrl){
        var oldUrl =req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }else{
        res.render('login');
    }
});
