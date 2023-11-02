const express = require("express");
const { sequelize } = require("./models");
const { rootRouter } = require("./routers");
const cookieParser = require("cookie-parser");
const XLSX = require("xlsx");

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

app.get("/api/v1/svm/recommendation", function (req, res) {
  // Đọc file
  const workbook = XLSX.readFile("svm.xlsx");
  const sheet_name_list = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheet_name_list[0]];

  // Lấy giá trị từ dòng 1 cột 1 và dòng 1 cột 2
  const valueA1 = worksheet["A1"].v;

  // Cập nhật giá trị của dòng 1 cột 1
  worksheet["A1"].v = valueA1 + 1;

  // Ghi lại file
  XLSX.writeFile(workbook, "svm.xlsx");
  res.status(200).json({ message: "OK" });
});
app.get("/api/v1/svm/recommendation/success", function (req, res) {
  // Đọc file
  const workbook = XLSX.readFile("svm.xlsx");
  const sheet_name_list = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheet_name_list[0]];

  // Lấy giá trị từ dòng 1 cột 1 và dòng 1 cột 2
  const valueB1 = worksheet["B1"].v;

  // Cập nhật giá trị của dòng 1 cột 1
  worksheet["B1"].v = valueB1 + 1;

  // Ghi lại file
  XLSX.writeFile(workbook, "svm.xlsx");
  res.status(200).json({ message: "OK" });
});

app.get("/api/v1/svm", function (req, res) {
  // Đọc file
  const workbook = XLSX.readFile("svm.xlsx");
  const sheet_name_list = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheet_name_list[0]];

  // Lấy giá trị từ dòng 1 cột 1 và dòng 1 cột 2
  const valueA1 = worksheet["A1"].v;
  const valueB1 = worksheet["B1"].v;

  res.status(200).json({
    totalRecommend: valueA1,
    totalSuccess: valueB1,
    percentSuccess: (valueB1 / valueA1) * 100,
  });
});

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
