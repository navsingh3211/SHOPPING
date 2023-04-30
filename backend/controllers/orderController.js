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



//get all orders (admin only)---> in progress
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    success: true,
    orders,
  });
});
