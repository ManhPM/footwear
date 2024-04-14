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
const { checkExistItemDetail } = require('../middlewares/checkExist');
const {
  checkCheckOut,
  checkCheckOutAtStore,
} = require('../middlewares/validate');
const cartRouter = express.Router();

cartRouter.get('/', authenticate, authorize(['Khách hàng']), getAllItemInCart);
cartRouter.post(
  '/add/:id_item_detail',
  authenticate,
  authorize(['Khách hàng']),
  checkExistItemDetail,
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
  '/remove/:id_item_detail',
  authenticate,
  authorize(['Khách hàng']),
  checkExistItemDetail,
  deleteOneItemInCart,
);
cartRouter.post(
  '/decrease/:id_item_detail',
  authenticate,
  authorize(['Khách hàng']),
  checkExistItemDetail,
  decreaseNumItemInCart,
);
cartRouter.post(
  '/increase/:id_item_detail',
  authenticate,
  authorize(['Khách hàng']),
  checkExistItemDetail,
  increaseNumItemInCart,
);
cartRouter.get(
  '/store',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  getAllItemInCartAtStore,
);
cartRouter.post(
  '/store/add/:id_item_detail',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistItemDetail,
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
  '/store/remove/:id_item_detail',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistItemDetail,
  deleteOneItemInCart,
);
cartRouter.post(
  '/store/decrease/:id_item_detail',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistItemDetail,
  decreaseNumItemInCart,
);
cartRouter.post(
  '/store/increase/:id_item_detail',
  authenticate,
  authorize(['Nhân viên', 'Admin']),
  checkExistItemDetail,
  increaseNumItemInCart,
);

module.exports = {
  cartRouter,
};
