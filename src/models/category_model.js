const {Schema , model} = require('mongoose');

const categorySchema = new Schema({
        categoryid: {type: String, required: true , unique: true},
        title: {type: String, required: true},
        addedon: {type:Date , default: Date.now}
});

const categoryModel = new model("category" , categorySchema);
module.exports = categoryModel;