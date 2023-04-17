const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


//Create product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});


//get product
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    });
});

//get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found !", 500));
    }

    res.status(200).json({
        success: true,
        product,
    });

});

//update products
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    // console.log(req.params.id);
    let product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new ErrorHandler("Product not found !", 500));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found !", 500));
    }

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product removed successfully"
    });
});