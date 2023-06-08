const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/productDB');
    console.log("Conetion Open");
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }

const productShema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    price:{
        type:Number
    },
    qty:{
        type: Number
    }
})

const Product =  mongoose.model('Product',productShema);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/product',(req,res)=>{
  
    
    Product.find({}).then( products =>{
        console.log(products);
        res.render('product',{products});
    });
    
});


app.get('/product/add',(req,res)=>{
    res.render('form');
});

app.post('/product',(req,res)=>{
    const {name,price,qty} = req.body;
    const newProduct = new Product({name:name,price:price,qty:qty});
    newProduct.save();
    res.redirect('/product');

});


app.listen(8080,()=>{
    console.log("Listen on port 8080");
})