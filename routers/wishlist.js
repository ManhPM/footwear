const express = require("express");
const {
  getAllItemInWishList,
  updateItemInWishList,
} = require("../controllers/wishlistController");
const { authenticate, authorize } = require("../middlewares/auth");
const wishlistRouter = express.Router();

wishlistRouter.get(
  "/",
  authenticate,
  authorize(["Khách hàng"]),
  getAllItemInWishList
);
wishlistRouter.post(
  "/:id_item",
  authenticate,
  authorize(["Khách hàng"]),
  updateItemInWishList
);

module.exports = {
  wishlistRouter,
};
