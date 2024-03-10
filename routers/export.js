const express = require('express');
const {
  getAllExport,
  completeExport,
  getAllItemInExport,
  getDetailExport,
  createExport,
  updateExport,
  deleteExport,
} = require('../controllers/exportController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkCompleteImportInvoice } = require('../middlewares/checkCreate');
const {
  checkExistImportInvoice,
  checkExistExport,
} = require('../middlewares/checkExist');

const exportRouter = express.Router();

exportRouter.get('/', authenticate, authorize(['Admin']), getAllExport);
exportRouter.post(
  '/complete/:id_export',
  authenticate,
  authorize(['Admin']),
  checkCompleteImportInvoice,
  completeExport,
);
exportRouter.get(
  '/list/:id_export',
  authenticate,
  authorize(['Admin']),
  checkExistExport,
  getAllItemInExport,
);

exportRouter.get(
  '/detail/:id_export',
  authenticate,
  authorize(['Admin']),
  checkExistExport,
  getDetailExport,
);

exportRouter.post('/create', authenticate, authorize(['Admin']), createExport);
exportRouter.put(
  '/update/:id_export',
  authenticate,
  authorize(['Admin']),
  checkExistExport,
  updateExport,
);
exportRouter.delete(
  '/delete/:id_export',
  authenticate,
  authorize(['Admin']),
  checkExistExport,
  deleteExport,
);

module.exports = {
  exportRouter,
};
