const express = require("express");
const { getAllExportInvoice, getAllItemInExportInvoice, createExportInvoice, updateExportInvoice, getDetailExportInvoice, createForm, completeExportInvoice, deleteExportInvoice } = require("../controllers/exportinvoice.controllers");
const {authorize} = require("../middlewares/auth/authorize.js")
const {authenticate} = require("../middlewares/auth/authenticate.js")
const exportinvoiceRouter = express.Router();

exportinvoiceRouter.get("/", authenticate, authorize(["Quản lý"]), getAllExportInvoice);
exportinvoiceRouter.get("/printreport/:flag", authenticate, authorize(["Quản lý"]), getAllExportInvoice);
exportinvoiceRouter.get("/complete/:id_e_invoice", authenticate, authorize(["Quản lý"]), completeExportInvoice);
exportinvoiceRouter.get("/detail/:id_e_invoice", authenticate, authorize(["Quản lý"]), getDetailExportInvoice);
exportinvoiceRouter.get("/createform", authenticate, authorize(["Quản lý"]), createForm);
exportinvoiceRouter.get("/list/:id_e_invoice", authenticate, authorize(["Quản lý"]), getAllItemInExportInvoice);
exportinvoiceRouter.post("/create", authenticate, authorize(["Quản lý"]), createExportInvoice);
exportinvoiceRouter.put("/update/:id_e_invoice", authenticate, authorize(["Quản lý"]), updateExportInvoice);
exportinvoiceRouter.delete("/delete/:id_e_invoice", authenticate, authorize(["Quản lý"]), deleteExportInvoice);

module.exports = {
    exportinvoiceRouter,
}