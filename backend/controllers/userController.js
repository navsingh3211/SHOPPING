const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


//register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
          public_id: "this is a sample id",
          url:"profilepicUrl"
      },
    });
    sendToken(user,200,res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    //checking that user has given email and password both
    if (!email || !password) {
        return next(new ErrorHandler("Please enter your email and password",400));
    }

    const user =await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password !",401));
    }

    const isPasswordMatched = user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password !", 401));
    }

    sendToken(user, 201,res);

});

//logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expire: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: "User logged out"
    });
});

//forget password
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  // console.log(user);
  const user = await User.findOne({ email: req.body.email });
  // console.log(user);
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  //Get Reset Password token
  const resetToken = user.getResetPasswordToken();
  
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :\n\n ${resetPasswordUrl} . \n\n If you have not requested this email then, ignore it.`;
  console.log(message);
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password 
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256", process.env.SECRET_FOR_HASH)
      .update(req.params.token)
        .digest("hex");    
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
    });
    console.log(user);
    if (!user) {
      return next(new ErrorHandler("Reset password token is invalid or has been expired !", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(
          new ErrorHandler(
            "Passowrd doesn't match !",
            400
          )
        );
    }

    user.password = req.body.password;
    user.resetPasswordToken =undefined;
    user.resetPasswordExpire = undefined; 
    await user.save();
    sendToken(user, 200, res);
});

