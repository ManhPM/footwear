const express = require("express");
const { getAllImportInvoice, getAllItemInImportInvoice, createImportInvoice, updateImportInvoice, createImportInvoiceDetail, deleteImportInvoiceDetail, updateImportInvoiceDetail, getDetailImportInvoice, createForm, deleteImportInvoice, completeImportInvoice } = require("../controllers/importinvoice.controllers");
const {authorize} = require("../middlewares/auth/authorize.js")
const {authenticate} = require("../middlewares/auth/authenticate.js");
const importinvoiceRouter = express.Router();

importinvoiceRouter.get("/", authenticate, authorize(["Quản lý"]), getAllImportInvoice);
importinvoiceRouter.get("/printreport/:flag", authenticate, authorize(["Quản lý"]), getAllImportInvoice);
importinvoiceRouter.get("/complete/:id_i_invoice", authenticate, authorize(["Quản lý"]), completeImportInvoice);
importinvoiceRouter.get("/createform", authenticate, authorize(["Quản lý"]), createForm);
importinvoiceRouter.get("/detail/:id_i_invoice", authenticate, authorize(["Quản lý"]), getDetailImportInvoice);
importinvoiceRouter.get("/list/:id_i_invoice", authenticate, authorize(["Quản lý"]), getAllItemInImportInvoice);
importinvoiceRouter.post("/create", authenticate, authorize(["Quản lý"]), createImportInvoice);
importinvoiceRouter.put("/update/:id_i_invoice", authenticate, authorize(["Quản lý"]), updateImportInvoice);
importinvoiceRouter.delete("/delete/:id_i_invoice", authenticate, authorize(["Quản lý"]), deleteImportInvoice);

module.exports = {
    importinvoiceRouter,
}