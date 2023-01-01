const userModel = require('./../models/user_model');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const cartModel = require('./../models/cart_model');
const cartitemModel = require('./../models/cart_item_model');

router.get("/:userid", async function (req, res) {
    const userid = req.params.userid;
    const foundUser = await userModel.findOne({ userid: userid });
    if (!foundUser) {
        res.json({ success: false, error: "user-not-found" });
        return;
    }
    res.json({ success: true, data: foundUser });

});

router.post("/createaccount", async function (req, res) {
    const userData = req.body;

    const password = userData.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPasswoed = await bcrypt.hash(password, salt);
    userData.password = hashedPasswoed;

    const newUser = new userModel(userData);
    await newUser.save(function (err) {
        if (err) {
            res.json({ success: false, error: err });
            return;
        }

        res.json({ success: true, data: newUser });
    });
});

router.post("/login", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const foundUser = await userModel.findOne({ email: email });
    if (!foundUser) {
        res.json({ success: false, error: "user-not-found" });
        return;
    }
    const correcrtPassword = await bcrypt.compare(password, foundUser.password);
    if (!correcrtPassword) {
        res.json({ success: false, error: "incorrect-password" });
        return;
    }

    res.json({ success: true, data: foundUser });
});

router.put("/", async function (req, res) {
    const userData = req.body;
    const userid = userData.userid;

    const result = await userModel.findOneAndUpdate({ userid: userid }, userData);
    if (!result) {
        res.json({ success: false, error: "user-not-found" });
        return;

    }

    res.json({ success: true, data: userData });

});


router.post("/:userid/addtocart", async function(req, res) {
    const userid = req.params.userid;
    const cartItemDetails = req.body;
    const userCart = await cartModel.findOne({ userid: userid });

    if(!userCart) {
        const newCartModel = new cartModel({ userid: userid, items: [] });
        await newCartModel.save(function(err) {
            if(err) {
                res.json({ success: false, error: err });
                return;
            }
        });

        cartItemDetails.cartid = newCartModel.cartid;
    }
    else {
        cartItemDetails.cartid = userCart.cartid;
    }

    const newCartItem = new cartitemModel(cartItemDetails);
    await newCartItem.save(async function(err) {
        if(err) {
            res.json({ success: false, error: err });
            return;
        }

        await cartModel.findOneAndUpdate({ cartid: newCartItem.cartid }, { $push: { items: newCartItem._id } });
        res.json({ success: true, data: newCartItem });
    });
});

router.get("/:userid/viewcart", async function (req, res) {
    const userid = req.params.userid;
    const foundCart = await cartModel.findOne({ userid: userid }).populate({
        path: "items", populate: {
            path: "product style",
        }
    });
    if (!foundCart) {
        res.json({ success: false, error: "cart-not-found" });
        return;
    }
    res.json({ success: true, data: foundCart });

});

router.delete("/:userid/removefromcart" , async function(req , res){
    const userid = req.params.userid;
    const cartItemsDetails = req.body;

    const updatedCart = await cartModel.findOneAndUpdate({userid : userid} , {$pull : {items : cartItemsDetails.itemid}});
    if (!updatedCart) {
        res.json({ success: false, error: "cart-not-exists" });
        return;
    }
    res.json({ success: true, data: cartItemsDetails });
    
});

module.exports = router;