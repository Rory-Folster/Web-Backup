const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create products Schema and model
const prodSchema = new Schema({
    product_name: {
        type:String,
        required: [true, 'Please enter a product name']
    },
    category: {
        type:String,
        required: [true, 'Please enter a catergory']
    },
    price: {
        type:Number,
        required: [true, 'Please enter a price']
    }
});

const Products = mongoose.model('Products', prodSchema);

module.exports = Products;