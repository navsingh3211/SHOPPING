const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return next(new ErrorHandler("please login to access this resource",401));
    }
    const decodedDate = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedDate.id);
    // console.log(req.user);
    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // console.log(req.user.role);
        if (!roles.includes(req.user.role)) {
            return next(
              new ErrorHandler(
                `Role:${req.user.role} is not allowed to access this resource`,
                403
              )
            );
        }
        next();
    };
};

