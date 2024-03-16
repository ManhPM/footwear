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
const { checkExistImport } = require('../middlewares/checkExist');
const { checkCompleteImport } = require('../middlewares/validate');

const importRouter = express.Router();

importRouter.get(
  '/',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  getAllImport,
);
importRouter.post(
  '/complete/:id_import',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  checkCompleteImport,
  completeImport,
);
importRouter.get(
  '/list/:id_import',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  checkExistImport,
  getAllItemInImport,
);

importRouter.get(
  '/detail/:id_import',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  checkExistImport,
  getDetailImport,
);

importRouter.post(
  '/create',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  createImport,
);
importRouter.put(
  '/update/:id_import',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  checkExistImport,
  updateImport,
);
importRouter.delete(
  '/delete/:id_import',
  authenticate,
  authorize(['Admin', 'Nhân viên']),
  checkExistImport,
  deleteImport,
);

module.exports = {
  importRouter,
};
