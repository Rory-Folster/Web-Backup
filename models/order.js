const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create order Schema and model
const OrderSchema = new Schema({
    products: {
        type:String,
        required: [true, 'A product name is required']
    },
    customer_name: {
        type:String,
        required: [true, 'A Customer name is required']
    },
    total_price: {
        type:Number,
        default: 0
    },
    stock: {
        type:Number,
        default: 0
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order; 