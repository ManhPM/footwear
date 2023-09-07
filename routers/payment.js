const express = require("express");
const { getAllPaymentMethod } = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.get("/", getAllPaymentMethod);

module.exports = {
  paymentRouter,
};
