const mongoose = require('mongoose');


const productShema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    price:{
        type:Number
    },
    qty:{
        type: Number,
        min:0
    }
})


const Product =  mongoose.model('Product',productShema);

module.exports = Product;