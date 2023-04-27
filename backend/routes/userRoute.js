const express = require("express");
const router = express.Router();  
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  logout,
  forgetPassword,
  resetPassword,
  updatePassword,
  getUserDetails,
  updateProfile,
} = require("../controllers/userController");


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/get_user_details").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/logout").get(logout);


module.exports = router;