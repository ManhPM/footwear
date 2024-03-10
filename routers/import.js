const express = require('express');
const {
  getAllImport,
  completeImport,
  getAllItemInImport,
  getDetailImport,
  createImport,
  updateImport,
  deleteImport,
} = require('../controllers/importController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkCompleteImportInvoice } = require('../middlewares/checkCreate');
const { checkExistImport } = require('../middlewares/checkExist');

const importRouter = express.Router();

importRouter.get('/', authenticate, authorize(['Admin']), getAllImport);
importRouter.post(
  '/complete/:id_import',
  authenticate,
  authorize(['Admin']),
  checkCompleteImportInvoice,
  completeImport,
);
importRouter.get(
  '/list/:id_import',
  authenticate,
  authorize(['Admin']),
  checkExistImport,
  getAllItemInImport,
);

importRouter.get(
  '/detail/:id_import',
  authenticate,
  authorize(['Admin']),
  checkExistImport,
  getDetailImport,
);

importRouter.post('/create', authenticate, authorize(['Admin']), createImport);
importRouter.put(
  '/update/:id_import',
  authenticate,
  authorize(['Admin']),
  checkExistImport,
  updateImport,
);
importRouter.delete(
  '/delete/:id_import',
  authenticate,
  authorize(['Admin']),
  checkExistImport,
  deleteImport,
);

module.exports = {
  importRouter,
};
