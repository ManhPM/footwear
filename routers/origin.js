const express = require('express');
const {
  getAllOrigin,
  createOrigin,
  updateOrigin,
  deleteOrigin,
  getDetailOrigin,
} = require('../controllers/originController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistOrigin } = require('../middlewares/checkExist');
const { checkUpdate, checkCreateOrigin } = require('../middlewares/validate');

const originRouter = express.Router();

originRouter.get('/', getAllOrigin);
originRouter.get('/:id', checkExistOrigin, getDetailOrigin);
originRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  checkCreateOrigin,
  createOrigin,
);
originRouter.put(
  '/update/:id',
  authenticate,
  authorize(['Admin']),
  checkExistOrigin,
  checkUpdate,
  updateOrigin,
);
originRouter.delete(
  '/delete/:id',
  authenticate,
  authorize(['Admin']),
  checkExistOrigin,
  deleteOrigin,
);

module.exports = {
  originRouter,
};
