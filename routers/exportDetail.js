const express = require('express');
const {
  getDetailExportDetail,
  createExportDetail,
  updateExportDetail,
  deleteExportDetail,
} = require('../controllers/exportDetailController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistExportDetail } = require('../middlewares/checkExist');
const exportDetailRouter = express.Router();

exportDetailRouter.get(
  '/detail',
  authenticate,
  authorize(['Admin']),
  checkExistExportDetail,
  getDetailExportDetail,
);
exportDetailRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  createExportDetail,
);
exportDetailRouter.put(
  '/update',
  authenticate,
  authorize(['Admin']),
  checkExistExportDetail,
  updateExportDetail,
);
exportDetailRouter.delete(
  '/delete',
  authenticate,
  authorize(['Admin']),
  checkExistExportDetail,
  deleteExportDetail,
);

module.exports = {
  exportDetailRouter,
};
