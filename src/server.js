const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('uploads'));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://AnkitGupta:123@cluster0.qmb2jtu.mongodb.net/ecommerce?retryWrites=true&w=majority").then(function(){

    app.get("/" , function(req, res){
        res.send("Ecommerce Setup");
    });

    const userRoutes = require('./routes/user_routes');
    app.use("/api/user" , userRoutes);

    const productRoutes = require('./routes/product_routes');
    app.use("/api/product" , productRoutes);

    const categoryRoutes = require('./routes/category_routes');
    app.use("/api/category" , categoryRoutes);

    const orderRoutes = require('./routes/order_routes');
    app.use("/api/order" , orderRoutes);

    const fileRoutes = require('./routes/file_routes');
    app.use("/api/file" , fileRoutes);
});


const PORT = 5000;
app.listen(PORT , function(){
    console.log(`server started at PORT: ${PORT}`);
});