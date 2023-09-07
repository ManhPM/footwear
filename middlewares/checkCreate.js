const { User, Discount, Item, Order, Import_invoice } = require("../models");
const { QueryTypes } = require("sequelize");

const checkCreateAccount = async (req, res, next) => {
  try {
    const { username } = req.body;
    console.log(username);
    const item = await User.findOne({
      where: {
        username,
      },
    });
    if (!item) {
      next();
    } else {
      res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "Middleware Error!", error: error.message });
  }
};

const checkCreateItem = async (req, res, next) => {
  try {
    const { name, numberOfVolumes } = req.body;
    const item = await Item.findOne({
      where: {
        name,
        numberOfVolumes,
      },
    });
    if (!item) {
      next();
    } else {
      res.status(400).json({
        message: "Sách đã tồn tại (tên, số tập)!",
      });
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "Middleware Error!", error: error.message });
  }
};

const checkCreateReview = async (req, res, next) => {
  try {
    const { id_order } = req.query;
    const order = await Order.findOne({
      where: {
        id_order,
      },
    });
    if (order.status == 4) {
      next();
    } else {
      res.status(400).json({
        message: "Đơn hàng chưa hoàn thành. Không thể đánh giá!",
      });
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "Middleware Error!", error: error.message });
  }
};

const checkPhoneCheckout = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id_user: req.user.id,
      },
    });
    if (user.phone) {
      next();
    } else {
      res.status(400).json({
        message: "Vui lòng cập nhật số điện thoại trước khi đặt hàng!",
      });
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "Middleware Error!", error: error.message });
  }
};

const checkDiscountCode = async (req, res, next) => {
  const { code } = req.body;
  try {
    if (code) {
      const discount = await Discount.findOne({
        where: {
          code,
        },
      });
      if (discount) {
        if (discount.quantity > 0) {
          const date = new Date();
          date.setHours(date.getHours() + 7);
          if (discount.end_date >= date) {
            next();
          } else {
            res
              .status(400)
              .json({ message: "Mã giảm giá đã hết hạn sử dụng!" });
          }
        } else {
          res.status(400).json({ message: "Mã giảm giá đã hết lượt sử dụng!" });
        }
      } else {
        res.status(400).json({ message: "Mã giảm giá không tồn tại!" });
      }
    } else {
      next();
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "Middleware Error!", error: error.message });
  }
};

const checkUnConfirmedOrder = async (req, res, next) => {
  try {
    const item = await Order.findOne({
      where: {
        id_user: req.user.id,
        status: 0,
      },
    });
    if (item) {
      res.status(400).json({
        message: "Bạn đang có đơn hàng chưa xác nhận, không thể đặt thêm!",
      });
    } else {
      next();
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "Middleware Error!", error: error.message });
  }
};

const checkCompleteImportInvoice = async (req, res, next) => {
  try {
    const { id_i_invoice } = req.params;
    const item = await Import_invoice.findOne({
      where: {
        id_i_invoice,
      },
    });
    if (item) {
      if (item.status != 1) {
        next();
      } else {
        res.status(400).json({
          message: "Đơn nhập đã hoàn thành, không thể hoàn thành nữa!",
        });
      }
    } else {
      res.status(400).json({
        message: "Đơn nhập không tồn tại!",
      });
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "Middleware Error!", error: error.message });
  }
};

module.exports = {
  checkCreateAccount,
  checkCreateItem,
  checkCreateReview,
  checkPhoneCheckout,
  checkDiscountCode,
  checkUnConfirmedOrder,
  checkCompleteImportInvoice,
};
