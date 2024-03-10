const {
  Import,
  Import_detail,
  Item,
  Export,
  Export_detail,
  Invoice,
} = require('../models');
const { QueryTypes } = require('sequelize');

const checkExistImport = async (req, res, next) => {
  try {
    const { id_import } = req.params;
    const item = await Import.findOne({
      where: {
        id_import,
      },
    });
    if (item) {
      next();
    } else {
      res.status(400).json({ message: 'Đơn nhập không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
  }
};

const checkExistExport = async (req, res, next) => {
  try {
    const { id_export } = req.params;
    const item = await Export.findOne({
      where: {
        id_export,
      },
    });
    if (item) {
      next();
    } else {
      res.status(400).json({ message: 'Đơn xuất không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
  }
};

const checkExistImportDetail = async (req, res, next) => {
  try {
    const { id_import, id_item } = req.body;
    const item = await Import_detail.findOne({
      where: {
        id_import,
        id_item,
      },
    });
    if (item) {
      next();
    } else {
      res.status(400).json({ message: 'Chi tiết đơn nhập không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
  }
};

const checkExistExportDetail = async (req, res, next) => {
  try {
    const { id_export, id_item } = req.body;
    const item = await Export_detail.findOne({
      where: {
        id_export,
        id_item,
      },
    });
    if (item) {
      next();
    } else {
      res.status(400).json({ message: 'Chi tiết đơn xuất không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
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
      res.status(400).json({ message: 'Sản phẩm không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
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
      res.status(400).json({ message: 'Số điện thoại đã tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
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
        res.status(400).json({ message: 'Email đã tồn tại!' });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkExistInvoice = async (req, res, next) => {
  const { id_invoice } = req.params;
  try {
    const item = await Invoice.findOne({
      where: {
        id_invoice,
      },
    });
    if (!item) {
      res.status(400).json({ message: 'Đơn hàng không tồn tại!' });
    } else {
      next();
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkExistStaff = async (req, res, next) => {
  const { id_staff } = req.params;
  try {
    const item = await Staff.findOne({
      where: {
        id_staff,
      },
    });
    if (!item) {
      res.status(400).json({ message: 'Nhân viên không tồn tại!' });
    } else {
      next();
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

module.exports = {
  checkExistImport,
  checkExistImportDetail,
  checkExistExport,
  checkExistExportDetail,
  checkExistItem,
  checkExistPhoneNum,
  checkExistEmail,
  checkExistInvoice,
  checkExistStaff,
};
