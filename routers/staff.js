const express = require('express');
const {
  updateStaff,
  getAllStaff,
  deleteStaff,
  getDetailStaff,
} = require('../controllers/staffController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistStaff } = require('../middlewares/checkExist');
const { checkUpdateStaff } = require('../middlewares/validate');

const staffRouter = express.Router();

staffRouter.get('/', authenticate, authorize(['Admin']), getAllStaff);
staffRouter.get(
  '/:id',
  authenticate,
  authorize(['Admin']),
  checkExistStaff,
  getDetailStaff,
);
staffRouter.put(
  '/update/:id',
  authenticate,
  authorize(['Admin']),
  checkExistStaff,
  checkUpdateStaff,
  updateStaff,
);
staffRouter.delete(
  '/delete/:id',
  authenticate,
  authorize(['Admin']),
  checkExistStaff,
  deleteStaff,
);

module.exports = {
  staffRouter,
};
