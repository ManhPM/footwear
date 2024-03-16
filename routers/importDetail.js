const express = require('express');
const {
  getDetailImportDetail,
  createImportDetail,
  updateImportDetail,
  deleteImportDetail,
} = require('../controllers/importDetailController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistImportDetail } = require('../middlewares/checkExist');
const importDetailRouter = express.Router();

importDetailRouter.get(
  '/detail',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  checkExistImportDetail,
  getDetailImportDetail,
);
importDetailRouter.post(
  '/create',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  createImportDetail,
);
importDetailRouter.put(
  '/update',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  checkExistImportDetail,
  updateImportDetail,
);
importDetailRouter.delete(
  '/delete',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  checkExistImportDetail,
  deleteImportDetail,
);

module.exports = {
  importDetailRouter,
};
