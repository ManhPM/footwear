const express = require("express");
const {
  register,
  accessForgotPassword,
  changePassword,
  forgotPassword,
  login,
  logout,
  updateProfile,
  verify,
  active,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");
const { checkCreateAccount } = require("../middlewares/checkCreate");
const {
  checkExistPhoneNum,
  checkExistEmail,
} = require("../middlewares/checkExist");

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post(
  "/register",
  checkCreateAccount,
  checkExistPhoneNum,
  checkExistEmail,
  register
);
userRouter.get("/active", active);
userRouter.post("/forgotpassword/success", accessForgotPassword);
userRouter.post("/forgotpasword/verify", verify);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/changepassword", authenticate, changePassword);
userRouter.get("/logout", authenticate, logout);
userRouter.post(
  "/updateprofile",
  authenticate,
  checkExistPhoneNum,
  checkExistEmail,
  updateProfile
);

module.exports = {
  userRouter,
};
