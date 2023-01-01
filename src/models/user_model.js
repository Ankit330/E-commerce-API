const {Schema , model} = require('mongoose');

const userSchema = new Schema({
    userid: {type: String , unique: true},
    fullname: {type: String},
    email: {type: String , unique: true},
    phone: {type: String , unique: true},
    password: {type: String},
    address: {type: String},
    country: {type: String},
    city: {type: String},
    pincode: {type: String},
    addedon: {type:Date , default: Date.now}
});


const userModel = new model("User" , userSchema);
module.exports = userModel;