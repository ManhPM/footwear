const express = require('express');
const {
  updateStaff,
  getAllStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistStaff } = require('../middlewares/checkExist');

const staffRouter = express.Router();

staffRouter.get('/', authenticate, authorize(['Admin']), getAllStaff);
staffRouter.put(
  '/update/:id_staff',
  authenticate,
  authorize(['Admin']),
  checkExistStaff,
  updateStaff,
);
staffRouter.delete(
  '/delete/:id_staff',
  authenticate,
  authorize(['Admin']),
  checkExistStaff,
  deleteStaff,
);

module.exports = {
  staffRouter,
};
