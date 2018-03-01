var express = require('express');
var router = express.Router();

var Product = require('../models/produt');

router.get('/', function(req, res, next) {
    Product.find(function (err, docs) {

        var productChucks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChucks.push(docs.slice(i, i + chunkSize));
        }
        res.render('videos', {title:'our videos', products: productChucks});
    });
});

//view the selected video

router.get('/view/:id', function (req, res) {
    var videoId = req.params.id;
    Product.findOne({_id:videoId}, function (err, data) {
        if(err){
            res.redirect('/videos');
        }
        // console.log('found the requested  video');
        // console.log(data);
        res.render('selectedVideo', {video:data});
    })

})

module.exports = router;
