const express = require('express');
const {
  getAllInvoice,
  confirmInvoice,
  cancelInvoice,
  getAllItemInInvoice,
  completeInvoice,
  statistics,
} = require('../controllers/invoiceController');
const { authenticate, authorize } = require('../middlewares/auth');

const { checkExistInvoice } = require('../middlewares/checkExist');

const invoiceRouter = express.Router();

invoiceRouter.get('/', authenticate, getAllInvoice);
invoiceRouter.get('/detail/:id_invoice', authenticate, getAllItemInInvoice);
invoiceRouter.get(
  '/confirm/:id_invoice',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistInvoice,
  confirmInvoice,
);
invoiceRouter.get(
  '/complete/:id_invoice',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistInvoice,
  completeInvoice,
);
invoiceRouter.get(
  '/cancel/:id_invoice',
  authenticate,
  authorize(['Nhân viên', 'Admin', 'Khách hàng']),
  checkExistInvoice,
  cancelInvoice,
);
invoiceRouter.get(
  '/statistics',
  authenticate,
  authorize(['Admin']),
  statistics,
);

module.exports = {
  invoiceRouter,
};
