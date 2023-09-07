const express = require("express");
const { userRouter } = require("./auth");
const { cartRouter } = require("./cart");
const { discountRouter } = require("./discount");
const { importInvoiceRouter } = require("./importInvoice");
const { importInvoiceDetailRouter } = require("./importInvoiceDetail");
const { orderRouter } = require("./order");
const { itemRouter } = require("./item");
const { paymentRouter } = require("./payment");
const { providerRouter } = require("./provider");
const { reviewRouter } = require("./review");
const { typeRouter } = require("./type");
const { uploadRouter } = require("./upload");
const { wishlistRouter } = require("./wishlist");
const rootRouter = express.Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/upload", uploadRouter);
rootRouter.use("/cart", cartRouter);
rootRouter.use("/discount", discountRouter);
rootRouter.use("/importinvoice", importInvoiceRouter);
rootRouter.use("/importinvoicedetail", importInvoiceDetailRouter);
rootRouter.use("/order", orderRouter);
rootRouter.use("/item", itemRouter);
rootRouter.use("/payment", paymentRouter);
rootRouter.use("/provider", providerRouter);
rootRouter.use("/type", typeRouter);
rootRouter.use("/review", reviewRouter);
rootRouter.use("/wishlist", wishlistRouter);

module.exports = {
  rootRouter,
};
