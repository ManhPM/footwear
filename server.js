const express = require("express");
const { Customer, Cart, Wishlist, Order } = require("./models");
const { sequelize } = require("./models");
const { rootRouter } = require("./routers");
const { QueryTypes } = require("sequelize");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const path = require("path");
const port = 4000;
const app = express();
const cors = require("cors");
const configfb = require("./config/configfb");
const bcrypt = require("bcryptjs");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID =
  "975421124869-n4irtjs1qrm9eq8hpddlpo5rma85rihn.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const corsOptions = {
  origin: process.env.ENV === "dev" ? true : "https://holidate.vercel.app",
  credentials: true,
};
//database connection
//middle ware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1", rootRouter);

//lắng nghe sự kiện kết nối
app.listen(port, async () => {
  console.log(`App listening on http://localhost:${port}`);
  try {
    await sequelize.authenticate();
    console.log("Kết nối thành công!.");
  } catch (error) {
    console.error("Kết nối thất bại:", error);
  }
});
