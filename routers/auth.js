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
const {
  checkCreateAccount,
  checkCreateEmail,
} = require("../middlewares/checkCreate");

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/register", checkCreateAccount, checkCreateEmail, register);
userRouter.get("/active", active);
userRouter.post("/forgotpassword/success", accessForgotPassword);
userRouter.post("/forgotpasword/verify", verify);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/changepassword", authenticate, changePassword);
userRouter.get("/logout", authenticate, logout);
userRouter.post("/updateprofile", authenticate, updateProfile);

module.exports = {
  userRouter,
};
