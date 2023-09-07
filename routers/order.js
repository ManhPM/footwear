const express = require("express");
const {
  cancelOrder,
  confirmOrder,
  getAllItemInOrder,
  getAllOrder,
  getAllOrderForShipper,
  receiveOrder,
  thongKeDonHangAdmin,
  thongKeSanPhamAdmin,
} = require("../controllers/orderController");
const { authenticate, authorize } = require("../middlewares/auth");

const { checkExistOrder } = require("../middlewares/checkExist");

const orderRouter = express.Router();

orderRouter.get("/", authenticate, getAllOrder);
orderRouter.get(
  "/ship",
  authenticate,
  authorize(["Giao hàng"]),
  getAllOrderForShipper
);
orderRouter.get(
  "/receive/:id_order",
  authenticate,
  authorize(["Giao hàng"]),
  checkExistOrder,
  receiveOrder
);
orderRouter.get("/detail/:id_order", authenticate, getAllItemInOrder);
orderRouter.get(
  "/confirm/:id_order",
  authenticate,
  authorize(["Nhân viên"]),
  checkExistOrder,
  confirmOrder
);
orderRouter.get(
  "/cancel/:id_order",
  authenticate,
  authorize(["Nhân viên", "Khách hàng"]),
  checkExistOrder,
  cancelOrder
);
// orderRouter.get(
//   "/thongkesanpham/admin",
//   authenticate,
//   authorize(["Admin"]),
//   thongKeSanPhamAdmin
// );
// orderRouter.get(
//   "/thongkedonhang/admin",
//   authenticate,
//   authorize(["Admin"]),
//   thongKeDonHangAdmin
// );

module.exports = {
  orderRouter,
};
