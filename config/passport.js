var passport = require('passport');
var User = require('../models/user');
var LocalStrategy =  require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null,user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err,user) {
        done(err,user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    question:'challengeQuestion',
    answer: 'challengeAnswer',
    passReqToCallback:true
}, function(req, email, password, done){
    const challengeQuestion = req.body.challengeQuestion;
    const challengeAnswer = req.body.challengeAnswer;

    req.checkBody('email','invalid email').notEmpty().isEmail();//validation
    req.checkBody('password','invalid password').notEmpty().isLength({min:4});
    req.checkBody('challengeQuestion','invalid password').notEmpty();
    req.checkBody('challengeAnswer','invalid password').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false,req.flash('error',messages));
    }
    User.findOne({'email':email},function (err,user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null,false,{message:'email already in use !'});
        }
        var newUser = new User();
        newUser.email = email;
        console.log(password);
        newUser.challengeQuestion = challengeQuestion;
        newUser.challengeAnswer =  challengeAnswer;
        newUser.password = newUser.encryptPassword(password);

        newUser.save(function (err, result) {
            if(err){
                return done(err);
            }
            else
                console.log(result);
            return done(null,newUser);
        });
    });
}));

//local sign in strategy
passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function (req,email,password,done) {
    //validation
    req.checkBody('email','invalid email').notEmpty().isEmail();//validation
    req.checkBody('password','invalid password').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false,req.flash('error',messages));
    }
    //finding the user from database
    User.findOne({'email':email},function (err,user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null,false,{message:'no user found with the requested email'});
        }
        if(!user.validPassword(password)){
            return done(null,false,{message:'password not valid'});
        }
        console.log(user);
        return done(null, user,{message:'successfully logined'});
    });

}));



//user/admin  registration

passport.use('local.userRegister', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    roleField:'role',
    passReqToCallback:true
}, function(req, email, password, done){
    // const challengeQuestion = req.body.challengeQuestion;
    // const challengeAnswer = req.body.challengeAnswer;
     const role = req.body.role;
     console.log('passport');

    req.checkBody('email','invalid email').notEmpty().isEmail();//validation
    req.checkBody('password','invalid password').notEmpty().isLength({min:4});

    var errors = req.validationErrors();
    if(errors){
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false,req.flash('error',messages));
    }
    User.findOne({'email':email},function (err,user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null,false,{message:'email already in use !'});
        }
        var newUser = new User();
        newUser.email = email;
        console.log(password);
        newUser.role = role;

        newUser.password = newUser.encryptPassword(password);

        newUser.save(function (err, result) {
            if(err){
                return done(err);
            }
            else
                console.log(result);
            return done(null,newUser);
        });
    });
}));