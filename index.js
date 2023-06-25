const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const AppError = require('./AppError');
const mongoose = require('mongoose');

const Product = require('./models/product');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/productDB');
    console.log("Conetion Open");
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }





app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);


app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));


function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e => next(e));
    }
}


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/product', wrapAsync( async (req,res,next)=>{
  
    
    const products = await Product.find({});
        //console.log(products);
        
    
    res.render('product',{products});
}));




app.post('/product',wrapAsync(async (req,res,next)=>{
    const {name,price,qty} = req.body;
    const newProduct = new Product({name:name,price:price,qty:qty});
    await newProduct.save();
    res.redirect('/product');

}));

app.get('/product/add',(req,res)=>{
    res.render('form');
});

app.get('/product/admin', wrapAsync(async (req,res,next)=>{
    const products = await Product.find({});
    res.render('admin',{products});
}));


app.get('/product/:id/edit', wrapAsync(async (req,res,next)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        throw new AppError('Product not found' ,404);
    }
    res.render('edit',{product})
}));

app.put('/product/:id',wrapAsync(async(req,res,next)=>{
    const {id} = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id,req.body,{runValidators:true, new:true});
    res.redirect("/product/admin");
}))

app.delete('/product/:id',wrapAsync(async(req,res,next)=>{
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/product/admin')
}))

app.patch('/product/:id/buy', wrapAsync(async (req,res,next)=>{
    const {id} = req.params;
    const productBought = await Product.findById(id);
    let newQty = productBought.qty -1;
    const newProcut = await Product.findByIdAndUpdate(id,{qty:newQty},{runValidators:true });
    //console.log(newProcut);
    res.redirect('/product');

}));

app.use((err,req,res,next)=>{
    const {status = 500,message = 'Something went wrong'} = err;
    res.status(status).send(message);
})

app.listen(8080,()=>{
    console.log("Listen on port 8080");
})