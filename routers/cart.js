const express = require("express");
const {
  checkout,
  createItemInCart,
  decreaseNumItemInCart,
  deleteOneItemInCart,
  getAllItemInCart,
  increaseNumItemInCart,
} = require("../controllers/cartController");
const { authenticate, authorize } = require("../middlewares/auth");
const {
  checkPhoneCheckout,
  checkDiscountCode,
  checkUnConfirmedOrder,
} = require("../middlewares/checkCreate");
const { checkExistItem } = require("../middlewares/checkExist");
const cartRouter = express.Router();

cartRouter.get("/", authenticate, authorize(["Khách hàng"]), getAllItemInCart);
cartRouter.post(
  "/add/:id_item",
  authenticate,
  authorize(["Khách hàng"]),
  checkExistItem,
  createItemInCart
);
cartRouter.post(
  "/checkout",
  authenticate,
  authorize(["Khách hàng"]),
  checkUnConfirmedOrder,
  checkPhoneCheckout,
  checkDiscountCode,
  checkout
);
cartRouter.delete(
  "/remove/:id_item",
  authenticate,
  authorize(["Khách hàng"]),
  checkExistItem,
  deleteOneItemInCart
);
cartRouter.post(
  "/decrease/:id_item",
  authenticate,
  authorize(["Khách hàng"]),
  checkExistItem,
  decreaseNumItemInCart
);
cartRouter.post(
  "/increase/:id_item",
  authenticate,
  authorize(["Khách hàng"]),
  checkExistItem,
  increaseNumItemInCart
);

module.exports = {
  cartRouter,
};
