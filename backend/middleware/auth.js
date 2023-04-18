const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return next(new ErrorHandler("please login to access this resource",401));
    }
    const decodedDate = jwt.verify(token, process.env.JWT_SECRET);
    req.user=await User.findById(decodedDate.id);
    next();
});

