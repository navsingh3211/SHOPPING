//creating token and saving it in cookie

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    // console.log(typeof `${process.env.COOKIE_EXPIRE}`);
    // console.log(
    //   Date.now() + parseInt(`${process.env.COOKIE_EXPIRE}`) * 24 * 60 * 60 * 1000
    // );
  
    //options for cookie
    const options = {
      expires: new Date(
        Date.now() +
          parseInt(`${process.env.COOKIE_EXPIRE}`) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token 
    });
}

module.exports = sendToken;