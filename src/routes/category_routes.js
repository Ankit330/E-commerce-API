const router = require('express').Router();
const categoryModel = require('./../models/category_model');

router.post("/", async function (req, res) {
    const categoryData = req.body;
    const newCategory = new categoryModel(categoryData);

    await newCategory.save(function (err) {
        if (err) {
            res.json({ success: false, error: err });
            return;
        }

        res.json({ success: true, data: newCategory });
    });
});


router.get("/", async function (req, res) {
    await categoryModel.find().exec(function (err, category) {
        if (err) {
            res.json({ success: false, error: err });
            return;
        }
        res.json({ success: true, data: category });
    });
});

router.delete("/", async function (req, res) {
    const categoryid = req.body.categoryid;
    const result = await categoryModel.findOneAndDelete({ categoryid: categoryid });
    if (!result) {
        res.json({ success: false, error: "category-not-found" });
    }
    res.json({ success: true, data: result });
});


router.put("/", async function (req, res) {
    const categoryData = req.body;
    const categoryid = categoryData.categoryid;

    const result = await  categoryModel.findOneAndUpdate({categoryid:categoryid} , categoryData);
    if (!result) {
        res.json({ success: false, error: "category-not-found" });
        return;

    }
    res.json({ success: true, data: categoryData});
    
});

module.exports = router;