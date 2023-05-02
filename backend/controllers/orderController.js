const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


//create new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
    res.status(200).json({
      success: true,
      order,
    });
});

//get single order details 
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    .populate("user","name email");//get user's name and email from user table by (specific user id from order module)
    
    if (!order) {
        return next(new ErrorHandler("No order found with the given Id!", 500));
    }

    res.status(200).json({
      success: true,
      order,
    });
});


//get logged in user single order details
exports.myOrders = catchAsyncErrors(async (req, res, next) => {

  const orders = await Order.find({ user: req.user._id.toString() });

  res.status(200).json({
      success: true,
      orders,
  });
});



//get all orders (admin only)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});


//update order status (Admin)
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (order.orderStatus == "Delivered") {
        return next(
            new ErrorHandler("You have already delivered this order", 500)
        );
    }
    order.orderItems.forEach(async (order) => {
        await updateStock(order.product,order.quantity);
    });
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt= Date.now();
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success: true
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}


//delete all orders (admin only)
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.findById(req.params.id);
    if (!orders) {
      return next(new ErrorHandler("No order found with the given Id!", 500));
    }
    await orders.deleteOne();

    res.status(200).json({
        success: true,
    });
});