const {
  Import_invoice,
  Import_invoice_detail,
  Item,
  User,
  Order,
} = require("../models");
const { QueryTypes } = require("sequelize");

const checkExistImportInvoice = async (req, res, next) => {
  try {
    const { id_i_invoice } = req.params;
    const item = await Import_invoice.findOne({
      where: {
        id_i_invoice,
      },
    });
    if (item) {
      next();
    } else {
      res.status(400).json({ message: "Đơn nhập không tồn tại!" });
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "CheckExist Error!", error: error.message });
  }
};

const checkExistImportInvoiceDetail = async (req, res, next) => {
  try {
    const { id_i_invoice, id_item } = req.body;
    const item = await Import_invoice_detail.findOne({
      where: {
        id_i_invoice,
        id_item,
      },
    });
    if (item) {
      next();
    } else {
      res.status(400).json({ message: "Chi tiết đơn nhập không tồn tại!" });
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "CheckExist Error!", error: error.message });
  }
};

const checkExistItem = async (req, res, next) => {
  try {
    const { id_item } = req.params;
    const item = await Item.findOne({
      where: {
        id_item,
      },
    });
    if (item) {
      next();
    } else {
      res.status(400).json({ message: "Sản phẩm không tồn tại!" });
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "CheckExist Error!", error: error.message });
  }
};

const checkExistPhoneNum = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const item = await User.findOne({
      where: {
        phone,
        isActive: 1,
      },
    });
    console.log(item, phone);
    if (!item || phone == item.phone) {
      next();
    } else {
      res.status(400).json({ message: "Số điện thoại đã tồn tại!" });
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "CheckExist Error!", error: error.message });
  }
};

const checkExistEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (email) {
      const item = await User.findOne({
        where: {
          email,
          isActive: 1,
        },
      });
      if (item) {
        res.status(400).json({ message: "Email đã tồn tại!" });
      } else {
        next();
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

const checkExistOrder = async (req, res, next) => {
  const { id_order } = req.params;
  try {
    const item = await Order.findOne({
      where: {
        id_order,
      },
    });
    if (!item) {
      res.status(400).json({ message: "Đơn hàng không tồn tại!" });
    } else {
      next();
    }
  } catch (error) {
    res
      .status(501)
      .json({ message: "Middleware Error!", error: error.message });
  }
};

module.exports = {
  checkExistImportInvoice,
  checkExistImportInvoiceDetail,
  checkExistItem,
  checkExistPhoneNum,
  checkExistEmail,
  checkExistOrder,
};
