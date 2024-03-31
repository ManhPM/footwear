const express = require('express');
const {
  checkout,
  createItemInCart,
  decreaseNumItemInCart,
  deleteOneItemInCart,
  getAllItemInCart,
  increaseNumItemInCart,
  getAllItemInCartAtStore,
} = require('../controllers/cartController');
const { authenticate, authorize } = require('../middlewares/auth');
const { checkExistItem } = require('../middlewares/checkExist');
const {
  checkCheckOut,
  checkCheckOutAtStore,
} = require('../middlewares/validate');
const cartRouter = express.Router();

cartRouter.get('/', authenticate, authorize(['Khách hàng']), getAllItemInCart);
cartRouter.post(
  '/add/:id_item',
  authenticate,
  authorize(['Khách hàng']),
  checkExistItem,
  createItemInCart,
);
cartRouter.post(
  '/checkout',
  authenticate,
  authorize(['Khách hàng']),
  checkCheckOut,
  checkout,
);
cartRouter.delete(
  '/remove/:id_item',
  authenticate,
  authorize(['Khách hàng']),
  checkExistItem,
  deleteOneItemInCart,
);
cartRouter.post(
  '/decrease/:id_item',
  authenticate,
  authorize(['Khách hàng']),
  checkExistItem,
  decreaseNumItemInCart,
);
cartRouter.post(
  '/increase/:id_item',
  authenticate,
  authorize(['Khách hàng']),
  checkExistItem,
  increaseNumItemInCart,
);
cartRouter.get(
  '/store',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  getAllItemInCartAtStore,
);
cartRouter.post(
  '/store/add/:id_item',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistItem,
  createItemInCart,
);
cartRouter.post(
  '/store/checkout',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkCheckOutAtStore,
  checkout,
);
cartRouter.delete(
  '/store/remove/:id_item',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistItem,
  deleteOneItemInCart,
);
cartRouter.post(
  '/store/decrease/:id_item',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistItem,
  decreaseNumItemInCart,
);
cartRouter.post(
  '/store/increase/:id_item',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistItem,
  increaseNumItemInCart,
);

module.exports = {
  cartRouter,
};
