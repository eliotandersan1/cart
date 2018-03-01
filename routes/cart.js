var express = require('express');
var router = express.Router();

var Product = require('../models/produt');


/* GET home page. */
router.get('/', function(req, res, next) {
    //get the cart from the session
    var cart = req.session.cart;
    var displayCart = {items: [], total:0};
    var total = 0;

    //ready the products to display
    for(var item in cart){
        displayCart.items.push( cart[item] );
        total += ( cart[item].qty * cart[item].price );
    }

    //total the values
    displayCart.total = total;
      console.log(displayCart);
    //render the cart
    res.render('cart', { title: 'My Cart',cart:displayCart });
});


//add to cart post configuration
router.post('/addToCart/:id', function ( req, res ) {
    console.log(req.session.cart);

     req.session.cart = req.session.cart || {} ;
    var cart = req.session.cart;
    Product.findOne({_id: req.params.id},function (err,data) {
        if(!err){

            if(cart[req.params.id]){

                req.session.cart[req.params.id].qty++;
                req.session.cart[req.params.id].price=data.price;

            }
            else{

                cart[req.params.id] = {

                    title:data.title,
                    price:data.price,
                    qty:1

                }

            }


            console.log("asdsadsad");
            res.redirect('/cart')

        }
    });
});

module.exports = router;