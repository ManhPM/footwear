const express = require('express');
const {
  createItem,
  deleteItem,
  getAllItem,
  getAllItemToImport,
  getDetailItem,
  updateItem,
  getAllType,
  getAllSize,
  getAllBrand,
  getAllOrigin,
  getAllMaterial,
  searchItem,
} = require('../controllers/itemController');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  checkExistItem,
  checkExistImport,
} = require('../middlewares/checkExist');
const { checkCreateItem } = require('../middlewares/validate');

const itemRouter = express.Router();

itemRouter.get('/', getAllItem);
itemRouter.get('/search', searchItem);
itemRouter.get('/filter/type', getAllType);
itemRouter.get('/filter/size', getAllSize);
itemRouter.get('/filter/brand', getAllBrand);
itemRouter.get('/filter/origin', getAllOrigin);
itemRouter.get('/filter/material', getAllMaterial);
itemRouter.get('/import/:id_import', checkExistImport, getAllItemToImport);
itemRouter.get('/detail/:id_item', checkExistItem, getDetailItem);
itemRouter.post(
  '/create',
  authenticate,
  authorize(['Admin']),
  checkCreateItem,
  createItem,
);
itemRouter.put(
  '/update/:id_item',
  authenticate,
  authorize(['Admin']),
  checkExistItem,
  updateItem,
);
itemRouter.delete(
  '/delete/:id_item',
  authenticate,
  authorize(['Admin']),
  checkExistItem,
  deleteItem,
);

module.exports = {
  itemRouter,
};
