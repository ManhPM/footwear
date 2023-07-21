const express = require("express");
const { createImportInvoiceDetail, updateImportInvoiceDetail, getDetailImportInvoiceDetail, deleteImportInvoiceDetail, createForm } = require("../controllers/importinvoicedetail.controllers");
const {authorize} = require("../middlewares/auth/authorize.js")
const {authenticate} = require("../middlewares/auth/authenticate.js");
const importinvoiceDetailRouter = express.Router();

importinvoiceDetailRouter.get("/detail/:id_i_invoice/:id_u_ingredient", authenticate, authorize(["Quản lý"]), getDetailImportInvoiceDetail);
importinvoiceDetailRouter.get("/createform/:id_i_invoice", authenticate, authorize(["Quản lý"]), createForm);
importinvoiceDetailRouter.post("/create/:id_i_invoice", authenticate, authorize(["Quản lý"]), createImportInvoiceDetail);
importinvoiceDetailRouter.put("/update/:id_i_invoice/:id_u_ingredient", authenticate, authorize(["Quản lý"]), updateImportInvoiceDetail);
importinvoiceDetailRouter.delete("/delete/:id_i_invoice/:id_u_ingredient", authenticate, authorize(["Quản lý"]), deleteImportInvoiceDetail);

module.exports = {
    importinvoiceDetailRouter,
}