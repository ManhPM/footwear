const express = require('express');
const {
  getAllSize,
  createSize,
  updateSize,
  deleteSize,
} = require('../controllers/sizeController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistSize } = require('../middlewares/checkExist');
const { checkUpdate, checkCreateSize } = require('../middlewares/validate');

const sizeRouter = express.Router();

sizeRouter.get('/', getAllSize);
sizeRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  checkCreateSize,
  createSize,
);
sizeRouter.put(
  '/update/:id',
  authenticate,
  authorize(['Admin']),
  checkExistSize,
  checkUpdate,
  updateSize,
);
sizeRouter.delete(
  '/delete/:id',
  authenticate,
  authorize(['Admin']),
  checkExistSize,
  deleteSize,
);

module.exports = {
  sizeRouter,
};
