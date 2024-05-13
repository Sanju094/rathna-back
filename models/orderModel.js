// models/orderModel.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            productName: {
                type: String,
                required: true
            }
        }
    ],
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
