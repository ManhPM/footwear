const express = require("express");
const { sequelize } = require("./models");
const { rootRouter } = require("./routers");
const cookieParser = require("cookie-parser");

const port = 4000;
const app = express();
const cors = require("cors");
const configfb = require("./config/configfb");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID =
  "975421124869-n4irtjs1qrm9eq8hpddlpo5rma85rihn.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
require("dotenv").config();
app.use(express.json());
const corsOptions = {
  origin: process.env.ENV === "dev" ? true : "https://localhost:3000",
  credentials: true,
};
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
