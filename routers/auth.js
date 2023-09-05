const express = require("express");
const { User } = require("../models");
const {
  register,
  accessForgotPassword,
  changePassword,
  forgotPassword,
  login,
  logout,
  updateProfile,
  verify,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/auth");

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/register", register);
userRouter.post("/forgotpassword/success", accessForgotPassword);
userRouter.post("/forgotpasword/verify", verify);
userRouter.post("/forgotpassword", forgotPassword);
userRouter.post("/changepassword", authenticate, changePassword);
userRouter.get("/logout", authenticate, logout);
userRouter.get("/logout", authenticate, updateProfile, logout);

module.exports = {
  userRouter,
};
