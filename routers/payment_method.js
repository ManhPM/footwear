const express = require('express');
const {
  getAllPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require('../controllers/paymentMethodController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistPaymentMethod } = require('../middlewares/checkExist');
const {
  checkUpdate,
  checkCreatePaymentMethod,
} = require('../middlewares/validate');

const paymentMethodRouter = express.Router();

paymentMethodRouter.get('/', getAllPaymentMethod);
paymentMethodRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  checkCreatePaymentMethod,
  createPaymentMethod,
);
paymentMethodRouter.put(
  '/update/:id',
  authenticate,
  authorize(['Admin']),
  checkExistPaymentMethod,
  checkUpdate,
  updatePaymentMethod,
);
paymentMethodRouter.delete(
  '/delete/:id',
  authenticate,
  authorize(['Admin']),
  checkExistPaymentMethod,
  deletePaymentMethod,
);

module.exports = {
  paymentMethodRouter,
};
