const express = require("express");
const { getAllDiscount, createDiscount, updateDiscount, getDetailDiscount, getAllDiscountAdmin, createForm } = require("../controllers/discount.controllers.js");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js");
const { checkCreateDiscount } = require("../middlewares/validates/checkCreate");
const discountRouter = express.Router();

discountRouter.get("/", getAllDiscount);
discountRouter.get("/admin", authenticate, authorize(["Admin"]), getAllDiscountAdmin);
discountRouter.get("/detail/:code", getDetailDiscount);
discountRouter.post("/create", authenticate, authorize(["Admin"]), checkCreateDiscount, createDiscount);
discountRouter.get("/createform", authenticate, authorize(["Admin"]), createForm);
discountRouter.put("/update/:code", authenticate, authorize(["Admin"]), updateDiscount);


module.exports = {
    discountRouter,
}