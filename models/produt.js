var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    price: {type:Number,required:true},
    category: {type:String,required:true},
    teaserUrl: {type:String,required:true},

});

module.exports = mongoose.model('Product',productSchema);