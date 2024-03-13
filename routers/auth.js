const express = require('express');
const {
  register,
  changePassword,
  forgotPassword,
  login,
  logout,
  updateProfile,
  profile,
  loginAdmin,
  verifyRegister,
  verifyChangeEmail,
  verifyForgotPassword,
  registerStaff,
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  checkLogin,
  checkRegister,
  checkVerifyID,
  checkChangePassword,
  checkUpdateProfile,
  checkCreateStaff,
} = require('../middlewares/validate');

const authRouter = express.Router();

authRouter.post('/login', checkLogin, login);
authRouter.post('/admin/login', checkLogin, loginAdmin);
authRouter.post('/register', checkRegister, register);
authRouter.post(
  '/register/staff',
  checkCreateStaff,
  checkRegister,
  registerStaff,
);
authRouter.get('/profile', authenticate, profile);
authRouter.post('/forgotpassword', forgotPassword);
authRouter.post('/verify/register', checkVerifyID, verifyRegister);
authRouter.post('/verify/changeemail', checkVerifyID, verifyChangeEmail);
authRouter.post('/verify/forgotpassword', checkVerifyID, verifyForgotPassword);
authRouter.post(
  '/changepassword',
  checkChangePassword,
  authenticate,
  changePassword,
);
authRouter.get('/logout', authenticate, logout);
authRouter.post(
  '/updateprofile',
  checkUpdateProfile,
  authenticate,
  updateProfile,
);

module.exports = {
  authRouter,
};
