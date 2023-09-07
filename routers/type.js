const express = require("express");
const { getAllType } = require("../controllers/typeController");

const typeRouter = express.Router();

typeRouter.get("/", getAllType);

module.exports = {
  typeRouter,
};
