const express = require("express");
const {Account} = require("../models")
const {login, createAccountForCustomer, changePassword, forgotPassword, verify, accessForgotPassword, createAccountForShipper, uploadAvatar, createAccountForStaff, updateProfile, edit, logout, getUserInfo, changePasswordUser} = require("../controllers/account.controllers");
const { checkExistAccount, checkExistAccountAdmin } = require("../middlewares/validates/checkExist");
const { checkCreateAccountCustomer, checkCreateEmail, checkCreateAccountShipper, checkCreateAccount, checkCreateEmailCustomer } = require("../middlewares/validates/checkCreate");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js")
const accountRouter = express.Router();

accountRouter.post("/login", checkExistAccount(Account), login);
accountRouter.post("/admin/login", checkExistAccountAdmin(Account), login);
accountRouter.get("/logout", authenticate, logout);
accountRouter.get("/edit", authenticate, edit);
accountRouter.put("/updateprofile", authenticate, authorize(["Khách hàng"]), updateProfile);
accountRouter.get("/profile", authenticate, getUserInfo);
accountRouter.post("/avatar", authenticate, uploadAvatar);
accountRouter.post("/create", checkCreateAccountCustomer(Account), checkCreateEmailCustomer, createAccountForCustomer);
accountRouter.post("/shipper/create/:id_shipping_partner", authenticate, authorize(["Admin"]), checkCreateAccountShipper(Account), createAccountForShipper);
accountRouter.post("/staff/create", authenticate, authorize(["Admin"]), checkCreateAccount(Account), checkCreateEmail, createAccountForStaff);
accountRouter.post("/forgotpassword", checkExistAccount(Account), forgotPassword);
accountRouter.put("/changepassword", authenticate, changePassword);
accountRouter.put("/changepassworduser", authenticate, authorize(["Khách hàng"]), changePasswordUser);

module.exports = {
    accountRouter,
}