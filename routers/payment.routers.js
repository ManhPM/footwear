const express = require("express");
const {Payment_method} = require("../models")
const { getAllPaymentMethod, createPaymentMethod, updatePaymentMethod, getDetailPaymentMethod, getAllPaymentMethodAdmin, createForm } = require("../controllers/payment.controllers.js");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js");
const { checkCreatePayment } = require("../middlewares/validates/checkCreate.js");
const paymentRouter = express.Router();

paymentRouter.get("/", getAllPaymentMethod);
paymentRouter.get("/admin", authenticate, authorize(["Admin"]), getAllPaymentMethodAdmin);
paymentRouter.get("/createform", authenticate, authorize(["Admin"]), createForm);
paymentRouter.get("/detail/:id_payment", authenticate, authorize(["Admin"]), getDetailPaymentMethod);
paymentRouter.post("/create", authenticate, authorize(["Admin"]), checkCreatePayment(Payment_method), createPaymentMethod);
paymentRouter.put("/update/:id_payment", authenticate, authorize(["Admin"]), checkCreatePayment(Payment_method), updatePaymentMethod);

module.exports = {
    paymentRouter,
}