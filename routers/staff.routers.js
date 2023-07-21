const express = require("express");
const {Account} = require("../models")
const { getAllStaff, createStaff, updateStaff, getDetailStaff, createForm } = require("../controllers/staff.controllers.js");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js");
const { checkCreateEmail, checkCreateAccountStaff } = require("../middlewares/validates/checkCreate.js");
const staffRouter = express.Router();

staffRouter.get("/", authenticate, authorize(["Admin"]), getAllStaff);
staffRouter.get("/detail/:id_staff", authenticate, authorize(["Admin"]), getDetailStaff);
staffRouter.post("/create", authenticate, authorize(["Admin"]), checkCreateEmail, checkCreateAccountStaff(Account), createStaff);
staffRouter.get("/createform", authenticate, authorize(["Admin"]), createForm);
staffRouter.put("/update/:id_staff", authenticate, authorize(["Admin"]), updateStaff);

module.exports = {
    staffRouter,
}