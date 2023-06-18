const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
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



app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'));


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/product', async (req,res)=>{
  
    
    const products = await Product.find({});
        //console.log(products);
        
    
    res.render('product',{products});
});




app.post('/product',(req,res)=>{
    const {name,price,qty} = req.body;
    const newProduct = new Product({name:name,price:price,qty:qty});
    newProduct.save();
    res.redirect('/product');

});

app.get('/product/add',(req,res)=>{
    res.render('form');
});

app.get('/product/admin', async (req,res)=>{
    const products = await Product.find({});
    res.render('admin',{products});
})


app.get('/product/:id/edit', async (req,res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);

    res.render('edit',{product})
})

app.put('/product/:id',async(req,res)=>{
    const {id} = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id,req.body,{runValidators:true, new:true});
    res.redirect("/product/admin");
})
app.delete('/product/:id',async(req,res)=>{
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/product/admin')
})

app.patch('/product/:id/buy', async (req,res)=>{
    const {id} = req.params;
    const productBought = await Product.findById(id);
    let newQty = productBought.qty -1;
    const newProcut = await Product.findByIdAndUpdate(id,{qty:newQty},{runValidators:true });
    //console.log(newProcut);
    res.redirect('/product');

});

app.listen(8080,()=>{
    console.log("Listen on port 8080");
})