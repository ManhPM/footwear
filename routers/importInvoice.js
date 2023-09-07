const express = require("express");
const {
  completeImportInvoice,
  createImportInvoice,
  deleteImportInvoice,
  getAllImportInvoice,
  getAllItemInImportInvoice,
  getDetailImportInvoice,
  updateImportInvoice,
} = require("../controllers/importInvoiceController");
const { authenticate, authorize } = require("../middlewares/auth");
const { checkCompleteImportInvoice } = require("../middlewares/checkCreate");
const { checkExistImportInvoice } = require("../middlewares/checkExist");

const importInvoiceRouter = express.Router();

importInvoiceRouter.get(
  "/",
  authenticate,
  authorize(["Admin"]),
  getAllImportInvoice
);
importInvoiceRouter.post(
  "/complete/:id_i_invoice",
  authenticate,
  authorize(["Admin"]),
  checkCompleteImportInvoice,
  completeImportInvoice
);
importInvoiceRouter.get(
  "/list/:id_i_invoice",
  authenticate,
  authorize(["Admin"]),
  checkExistImportInvoice,
  getAllItemInImportInvoice
);

importInvoiceRouter.get(
  "/detail/:id_i_invoice",
  authenticate,
  authorize(["Admin"]),
  checkExistImportInvoice,
  getDetailImportInvoice
);

importInvoiceRouter.post(
  "/create",
  authenticate,
  authorize(["Admin"]),
  createImportInvoice
);
importInvoiceRouter.put(
  "/update/:id_i_invoice",
  authenticate,
  authorize(["Admin"]),
  checkExistImportInvoice,
  updateImportInvoice
);
importInvoiceRouter.delete(
  "/delete/:id_i_invoice",
  authenticate,
  authorize(["Admin"]),
  checkExistImportInvoice,
  deleteImportInvoice
);

module.exports = {
  importInvoiceRouter,
};
