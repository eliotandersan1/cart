var express = require('express');
var router = express.Router();

var Product = require('../models/produt');
var User = require('../models/user');
var auth = require('../lib/auth');
var passport = require('passport');
//var UserRegister = require('../models/userRegistration');

router.all('/products/*',auth.authenticate('admin'));

/* GET produts */
router.get('/products', function(req, res, next) {
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize =3;
        for(i = 0; i <docs.length; i += chunkSize){
            productChunks.push(docs.slice(i, i+chunkSize));
        }
        res.render('products', { title: 'Products', products:productChunks });
    });

});
//post products
router.post('/products', function(req, res, next) {
    var newProduct = new Product();
    newProduct.title = req.body.title;
    newProduct.description = req.body.description;
    newProduct.price = req.body.price;
    newProduct.date = new Date().toString();
    newProduct.category = req.body.category;
    newProduct.teaserUrl = req.body.teaserUrl;

    newProduct.save(function (err, result) {
        if(err){
            return err;
        }
        else
            console.log(result);
        res.redirect('/admin/products');
        return newProduct;
    });

});

//edit  the product get configuration

router.get('/products/edit/:id', function (req, res, next) {
    var productId = req.params.id;
    Product.findOne({_id:productId}, function (err, data) {
        if(err){
            res.redirect('/');
        }
        res.render('productEdit',{product:data});
    })
});

//update/edit post the products
router.post('/products/edit/:id',function (req,res) {
    Product.findOne({_id: req.params.id},
        function (err, data) {
            if(!err){
                data.title = req.body.title;
                data.description =req.body.description;
                data. price =req.body.price;
                data. category = req.body.category;
                data. teaserUrl = req.body.teaserUrl;

                data.save(function (err, data) {
                        console.log('data is successfully updated/Edited', data);
                        res.redirect('/admin/products');
                    });
            }
        });
});




router.post('/products/delete/:id', function (req, res) {
    // var id = req.params.id;
    console.log('hiiiiiiiiiiiiiiiiiiii');
        Product.findByIdAndRemove(req.params.id, function (err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }

            res.redirect('/admin/products');
        });

});


//get the admin|| user form route

router.get('/userRegister', function(req, res, next) {
    User.find(function (err, doc) {
        if(err){
            res.send(err);
        }
        var userChunks = [];
        var chunkSize = 1;
        for(var i=0; i<doc.length; i+=chunkSize){
            userChunks.push(doc.slice(i, i+chunkSize));
        }
        console.log(userChunks);

        res.render('users',{user:userChunks});
        // console.log('docs areeeeee',doc);

    });
});

//post the admin|| user form route
//
// router.post('/userRegister', function(req, res, next) {
//     User.findOne({email:req.body.email },function ( err, userData ) {
//         console.log(req.body.password);
//         console.log(req.body.role);
//         console.log('entered in userRegister post');
//         if(err){
//             console.log(err);
//             return ;
//         }
//         if( userData ){
//
//             res.send('User already exist');
//             return;
//         }
//         var newUsers = new User();
//         newUsers.email = req.body.email;
//         newUsers.password = req.body.password;
//         newUsers.userRole = req.body.role;
//
//         newUsers.save(function (err, result) {
//             if(err){
//                 console.log(err);
//                 return (err);
//             }
//             else{
//                 console.log(result);
//                 res.redirect('/admin/userRegister');
//             }
//
//             // return (newUsers);
//         });
//     })
//
// });
router.post('/userRegister',passport.authenticate('local.userRegister',{
    failureRedirect: '/',
    failureFlash: true
}), function (req, res, next) {
    if(req.session.oldUrl){
        var oldUrl =req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }else{
        res.redirect('/admin/userRegister');
    }
});

//delete  the user/admin route
router.post('/users/delete/:id', function (req, res) {
    // var id = req.params.id;
    console.log('hiiiiiiiiiiiiiiiiiiii');
    User.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        res.redirect('/admin/userRegister');
    });

});
//edit  the user/admin get configuration

router.get('/users/edit/:id', function (req, res, next) {
    var userId = req.params.id;
    User.findOne({_id:userId}, function (err, data) {
        if(err){
            res.redirect('/');
        }
        res.render('userEdit',{user:data});
    })
});


//update/edit post the user/admin
router.post('/users/edit/:id',function (req,res) {
    User.findOne({_id: req.params.id},
        function (err, data) {
            if(!err){
                data.email = req.body.email;
                data.password =req.body.password;
                data. userRole =req.body.role;

                data.save(function (err, data) {
                    console.log('data is successfully updated/Edited', data);
                    res.redirect('/admin/userRegister');
                });
            }
        });
});


module.exports = router;