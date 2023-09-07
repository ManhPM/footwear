const express = require("express");
const { getAllDiscount } = require("../controllers/discountController");
const discountRouter = express.Router();

discountRouter.get("/", getAllDiscount);

module.exports = {
  discountRouter,
};
