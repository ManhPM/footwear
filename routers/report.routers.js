const express = require("express");
const { getAllReport, getReportDetail, showReport } = require("../controllers/report.controllers.js");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js");
const reportRouter = express.Router();

reportRouter.get("/", authenticate, authorize(["Admin","Quản lý"]), getAllReport);
reportRouter.get("/printreport/:flag", authenticate, authorize(["Admin","Quản lý"]), getAllReport);
reportRouter.get("/detail/:id_report", authenticate, authorize(["Admin","Quản lý"]), getReportDetail);

module.exports = {
    reportRouter,
}