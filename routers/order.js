const express = require("express");
const {
  cancelOrder,
  confirmOrder,
  getAllItemInOrder,
  getAllOrder,
  receiveOrder,
  thongKeSanPham,
} = require("../controllers/orderController");
const { authenticate, authorize } = require("../middlewares/auth");

const { checkExistOrder } = require("../middlewares/checkExist");

const orderRouter = express.Router();

orderRouter.get("/", authenticate, getAllOrder);
orderRouter.get(
  "/receive/:id_order",
  authenticate,
  authorize(["Nhân viên", "Admin"]),
  checkExistOrder,
  receiveOrder
);
orderRouter.get("/detail/:id_order", authenticate, getAllItemInOrder);
orderRouter.get(
  "/confirm/:id_order",
  authenticate,
  authorize(["Nhân viên", "Admin"]),
  checkExistOrder,
  confirmOrder
);
orderRouter.get(
  "/cancel/:id_order",
  authenticate,
  authorize(["Nhân viên", "Admin", "Khách hàng"]),
  checkExistOrder,
  cancelOrder
);
orderRouter.get("/thongke", authenticate, authorize(["Admin"]), thongKeSanPham);

module.exports = {
  orderRouter,
};
