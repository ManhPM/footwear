const express = require("express");
const { getAllProvider } = require("../controllers/providerController");
const { authenticate, authorize } = require("../middlewares/auth");

const providerRouter = express.Router();

providerRouter.get("/", authenticate, authorize(["Admin"]), getAllProvider);

module.exports = {
  providerRouter,
};
