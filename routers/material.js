const express = require('express');
const {
  getAllMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistMaterial } = require('../middlewares/checkExist');
const { checkUpdate, checkCreateMaterial } = require('../middlewares/validate');

const materialRouter = express.Router();

materialRouter.get('/', getAllMaterial);
materialRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  checkCreateMaterial,
  createMaterial,
);
materialRouter.put(
  '/update/:id',
  authenticate,
  authorize(['Admin']),
  checkExistMaterial,
  checkUpdate,
  updateMaterial,
);
materialRouter.delete(
  '/delete/:id',
  authenticate,
  authorize(['Admin']),
  checkExistMaterial,
  deleteMaterial,
);

module.exports = {
  materialRouter,
};
