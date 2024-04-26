const express = require('express');
const {
  getAllType,
  createType,
  updateType,
  deleteType,
  getDetailType,
} = require('../controllers/typeController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistType } = require('../middlewares/checkExist');
const { checkUpdate, checkCreateType } = require('../middlewares/validate');

const typeRouter = express.Router();

typeRouter.get('/', getAllType);
typeRouter.get('/:id', checkExistType, getDetailType);
typeRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  checkCreateType,
  createType,
);
typeRouter.put(
  '/update/:id',
  authenticate,
  authorize(['Admin']),
  checkExistType,
  checkUpdate,
  updateType,
);
typeRouter.delete(
  '/delete/:id',
  authenticate,
  authorize(['Admin']),
  checkExistType,
  deleteType,
);

module.exports = {
  typeRouter,
};
