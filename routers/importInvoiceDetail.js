const express = require("express");
const {
  createImportInvoiceDetail,
  deleteImportInvoiceDetail,
  getDetailImportInvoiceDetail,
  updateImportInvoiceDetail,
} = require("../controllers/importInvoiceDetailController");
const { authenticate, authorize } = require("../middlewares/auth");
const { checkExistImportInvoiceDetail } = require("../middlewares/checkExist");
const importInvoiceDetailRouter = express.Router();

importInvoiceDetailRouter.get(
  "/detail",
  authenticate,
  authorize(["Admin"]),
  checkExistImportInvoiceDetail,
  getDetailImportInvoiceDetail
);
importInvoiceDetailRouter.post(
  "/create",
  authenticate,
  authorize(["Admin"]),
  createImportInvoiceDetail
);
importInvoiceDetailRouter.put(
  "/update",
  authenticate,
  authorize(["Admin"]),
  checkExistImportInvoiceDetail,
  updateImportInvoiceDetail
);
importInvoiceDetailRouter.delete(
  "/delete",
  authenticate,
  authorize(["Admin"]),
  checkExistImportInvoiceDetail,
  deleteImportInvoiceDetail
);

module.exports = {
  importInvoiceDetailRouter,
};
