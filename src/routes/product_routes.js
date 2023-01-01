const router = require('express').Router();
const productModel = require('./../models/product_model');
const productStyleModel = require('./../models/style_model');

router.get("/", async function (req, res) {
    await productModel.find().populate('category styles').exec(function (err, Product) {
        if (err) {
            res.json({ success: false, error: err });
            return;
        }
        res.json({ success: true, data: Product });
    });
});

router.delete("/", async function (req, res) {
    const productid = req.body.productid;
    const result = await productModel.findOneAndDelete({ productid: productid });
    if (!result) {
        res.json({ success: false, error: "product-not-found" });
        return
    }
    res.json({ success: true, data: result });
});

router.post("/", async function (req, res) {
    const productData = req.body;

    const styleids = [];
    productData.styles.forEach(async function(style) {
        const newStyle = new productStyleModel(style);
        styleids.push(newStyle._id);
        await newStyle.save(function(err) {
            if(err) {
                res.json({ success: false, error: err });
                return;
            }
        });
    });

    productData.styles = styleids;

    const newProduct = new productModel(productData);
    await newProduct.save(function(err) {
        if(err) {
            res.json({ success: false, error: err });
            return;
        }

        res.json({ success: true, data: newProduct });
    });
});

router.put("/", async function (req, res) {
    const productData = req.body;
    const productid = productData.productid;

    const result = await  productModel.findOneAndUpdate({productid:productid} , productData);
    if (!result) {
        res.json({ success: false, error: "product-not-found" });
        return;

    }
    res.json({ success: true, data: productData});
    
});

module.exports = router;