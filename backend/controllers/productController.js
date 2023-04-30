const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");


//Create product --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user=req.user.id;  
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});


//get product
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultperPage = 5;
    const productCount = await Product.countDocuments();

    //applying search feature
    const apifeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultperPage);
    
    const products = await apifeature.query;
    res.status(200).json({
      success: true,
      products,
      productCount,
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

//create New review or update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating,comment,productId}=req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating:Number(rating),
        comment
    };

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (!product) {
        return next(new ErrorHandler("Product not found !", 500));
    }

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating=rating,
                rev.comment=comment
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    }) ;
    product.ratings = avg / product.reviews.length;
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success: true
    });
});

//get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found !", 500));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return next(new ErrorHandler("Product not found !", 500));
    }

    //reviews that we don't have to delete
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );
    
    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify:false
    });

    res.status(200).json({
      success: true
    });
});
