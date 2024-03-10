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
  authorize(['Admin']),
  checkExistImportDetail,
  getDetailImportDetail,
);
importDetailRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  createImportDetail,
);
importDetailRouter.put(
  '/update',
  authenticate,
  authorize(['Admin']),
  checkExistImportDetail,
  updateImportDetail,
);
importDetailRouter.delete(
  '/delete',
  authenticate,
  authorize(['Admin']),
  checkExistImportDetail,
  deleteImportDetail,
);

module.exports = {
  importDetailRouter,
};
