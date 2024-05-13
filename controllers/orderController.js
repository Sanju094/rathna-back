const catchAsyncError = require('../middlewares/catchAsyncError');
const user = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const mail=require('../utils/email');
//Create New Order - api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
console.log("try")
    const {
        userName,
        products
    } = req.body;

    // Retrieve details of each product
    const orderItemsWithDetails = await Promise.all(products.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
            productId: item.productId,
            productName: product.name // Assuming your product model has a 'name' field
        };
    }));

    // Create the order with the user's ID from the request and other details
    const order = await Order.create({
        user: req.user.id, // Assuming you have user ID stored in req.user.id
        userName,
        products: orderItemsWithDetails, // Replace 'products' with 'orderItemsWithDetails'
        paidAt: Date.now(), // Assuming you want to mark the order as paid at the current time
    });
    
    const orderedProductNames = orderItemsWithDetails.map(item => item.productName).join(', ');

    mail(req.user.email, "Your products have been booked successfully", `Dear ${req.user.name},\n\nYour order has been successfully placed. Thank you for shopping with us.\n Buy the booked products in 24 hours of booking  else your order will not be reserved\n\nOrdered Products:\n${orderedProductNames}`);

    // Respond with the newly created order
    res.status(200).json({
        success: true,
        order
    });
});



//Get Single Order - api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

//Get Loggedin User Orders - /api/v1/myorders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
})

//Admin: Get All Orders - api/v1/orders
exports.orders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//Admin: Update Order / Order Status - api/v1/order/:id
exports.updateOrder =  catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus == 'Delivered') {
        return next(new ErrorHandler('Order has been already delivered!', 400))
    }
    //Updating the product stock of each order item
    order.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity)
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true
    })
    
});

async function updateStock (productId, quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave: false})
}

//Admin: Delete Order - api/v1/order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }

    await order.remove();
    res.status(200).json({
        success: true
    })
})

