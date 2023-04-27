const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //wrong mongodb Id error (cast error while passing wrong productId)
  if (err.name === "CastError") {
    const message = `Resourse not found. Invalid:${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //mongoose duplicate key error
  // if ((err.code = 11000)) {
  //   const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
  //   err = new ErrorHandler(message, 400);
  // }

  //wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid,Try again`;
    err = new ErrorHandler(message, 400);
  }

  //wrong Expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired,Try again`;
    err = new ErrorHandler(message, 400);
  }
    
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
}