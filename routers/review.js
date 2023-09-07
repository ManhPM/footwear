const express = require("express");
const {
  createReview,
  getAllReviewByItem,
} = require("../controllers/reviewController");
const { authenticate } = require("../middlewares/auth");
const { checkCreateReview } = require("../middlewares/checkCreate");

const reviewRouter = express.Router();

reviewRouter.get("/:id_item", getAllReviewByItem); //*
reviewRouter.post("/:id_item", authenticate, checkCreateReview, createReview); //*

module.exports = {
  reviewRouter,
};
