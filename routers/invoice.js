const express = require('express');
const {
  getAllInvoice,
  confirmInvoice,
  cancelInvoice,
  getAllItemInInvoice,
} = require('../controllers/invoiceController');
const { authenticate, authorize } = require('../middlewares/auth');

const { checkExistInvoice } = require('../middlewares/checkExist');

const invoiceRouter = express.Router();

invoiceRouter.get('/', authenticate, getAllInvoice);
invoiceRouter.get('/detail/:id_order', authenticate, getAllItemInInvoice);
invoiceRouter.get(
  '/confirm/:id_order',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistInvoice,
  confirmInvoice,
);
invoiceRouter.get(
  '/cancel/:id_order',
  authenticate,
  authorize(['Nhân viên', 'Admin', 'Khách hàng']),
  checkExistInvoice,
  cancelInvoice,
);
// invoiceRouter.get('/thongke', authenticate, authorize(['Admin']), thongKeSanPham);

module.exports = {
  invoiceRouter,
};
