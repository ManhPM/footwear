const express = require("express");
const {
  createReview,
  getAllReviewByItem,
} = require("../controllers/reviewController");
const { authenticate } = require("../middlewares/auth");
const { checkCreateReview } = require("../middlewares/checkCreate");
const { checkExistItem } = require("../middlewares/checkExist");

const reviewRouter = express.Router();

reviewRouter.get("/:id_item", checkExistItem, getAllReviewByItem);
reviewRouter.post(
  "/:id_item",
  authenticate,
  checkCreateReview,
  checkExistItem,
  createReview
);

module.exports = {
  reviewRouter,
};
