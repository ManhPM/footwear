const express = require("express");
const { getDetailExportInvoiceDetail, deleteExportInvoiceDetail, updateExportInvoiceDetail, createExportInvoiceDetail, createForm } = require("../controllers/exportinvoicedetail.controllers");
const {authorize} = require("../middlewares/auth/authorize.js")
const {authenticate} = require("../middlewares/auth/authenticate.js");
const exportinvoiceDetailRouter = express.Router();

exportinvoiceDetailRouter.get("/detail/:id_e_invoice/:id_u_ingredient", authenticate, authorize(["Quản lý"]), getDetailExportInvoiceDetail);
exportinvoiceDetailRouter.get("/createform/:id_e_invoice", authenticate, authorize(["Quản lý"]), createForm);
exportinvoiceDetailRouter.post("/create/:id_e_invoice", authenticate, authorize(["Quản lý"]), createExportInvoiceDetail);
exportinvoiceDetailRouter.put("/update/:id_e_invoice/:id_u_ingredient", authenticate, authorize(["Quản lý"]), updateExportInvoiceDetail);
exportinvoiceDetailRouter.delete("/delete/:id_e_invoice/:id_u_ingredient", authenticate, authorize(["Quản lý"]), deleteExportInvoiceDetail);

module.exports = {  
    exportinvoiceDetailRouter,
}