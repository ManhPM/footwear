const express = require('express');
const {
  getAllProvider,
  createProvider,
  updateProvider,
  deleteProvider,
} = require('../controllers/providerController');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  checkCreateProvider,
  checkUpdateProvider,
} = require('../middlewares/validate');
const { checkExistProvider } = require('../middlewares/checkExist');

const providerRouter = express.Router();

providerRouter.get('/', authenticate, authorize(['Admin']), getAllProvider);
providerRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  checkCreateProvider,
  createProvider,
);
providerRouter.put(
  '/update/:id_provider',
  authenticate,
  authorize(['Admin']),
  checkExistProvider,
  checkUpdateProvider,
  updateProvider,
);
providerRouter.delete(
  '/delete/:id_provider',
  authenticate,
  authorize(['Admin']),
  checkExistProvider,
  deleteProvider,
);

module.exports = {
  providerRouter,
};
