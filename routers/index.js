const express = require("express");
const { userRouter } = require("./auth");
const rootRouter = express.Router();

rootRouter.use("/user", userRouter);

module.exports = {
  rootRouter,
};
