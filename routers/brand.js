const express = require('express');
const {
  getAllBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getDetailBrand,
} = require('../controllers/brandController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistBrand } = require('../middlewares/checkExist');
const { checkUpdate, checkCreateBrand } = require('../middlewares/validate');

const brandRouter = express.Router();

brandRouter.get('/', getAllBrand);
brandRouter.get('/:id', checkExistBrand, getDetailBrand);
brandRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  checkCreateBrand,
  createBrand,
);
brandRouter.put(
  '/update/:id',
  authenticate,
  authorize(['Admin']),
  checkExistBrand,
  checkUpdate,
  updateBrand,
);
brandRouter.delete(
  '/delete/:id',
  authenticate,
  authorize(['Admin']),
  checkExistBrand,
  deleteBrand,
);

module.exports = {
  brandRouter,
};
