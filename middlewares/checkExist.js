const {
  Import,
  Import_detail,
  Item,
  Type,
  Size,
  Origin,
  Material,
  Brand,
  Invoice,
  Provider,
  Staff,
  Item_detail,
  Payment_method,
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

const checkExistImportDetail = async (req, res, next) => {
  try {
    const { id_import, id_item_detailf } = req.body;
    const item = await Import_detail.findOne({
      where: {
        id_import,
        id_item_detailf,
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

const checkExistItemDetail = async (req, res, next) => {
  try {
    const { id_item_detail } = req.params;
    const item = await Item_detail.findOne({
      where: {
        id_item_detail,
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
  const { id } = req.params;
  try {
    const item = await Staff.findByPk(id);
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

const checkExistProvider = async (req, res, next) => {
  const { id } = req.params;
  try {
    const item = await Provider.findByPk(id);
    if (!item) {
      res.status(400).json({ message: 'Nhà cung cấp không tồn tại!' });
    } else {
      next();
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkExistType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Type.findByPk(id);
    if (item) {
      next();
    } else {
      res.status(400).json({ message: 'Loại không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
  }
};

const checkExistSize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Size.findByPk(id);
    if (item) {
      next();
    } else {
      res.status(400).json({ message: 'Size không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
  }
};

const checkExistBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Brand.findByPk(id);
    if (item) {
      next();
    } else {
      res.status(400).json({ message: 'Brand không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
  }
};

const checkExistMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Material.findByPk(id);
    if (item) {
      next();
    } else {
      res.status(400).json({ message: 'Chất liệu không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
  }
};

const checkExistOrigin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Origin.findByPk(id);
    if (item) {
      next();
    } else {
      res.status(400).json({ message: 'Xuất xứ không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
  }
};

const checkExistPaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Payment_method.findByPk(id);
    if (item) {
      next();
    } else {
      res
        .status(400)
        .json({ message: 'Phương thức thanh toán không tồn tại!' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'CheckExist Error!', error: error.message });
  }
};

module.exports = {
  checkExistImport,
  checkExistImportDetail,
  checkExistItem,
  checkExistPhoneNum,
  checkExistEmail,
  checkExistInvoice,
  checkExistStaff,
  checkExistProvider,
  checkExistItemDetail,
  checkExistType,
  checkExistBrand,
  checkExistMaterial,
  checkExistOrigin,
  checkExistSize,
  checkExistPaymentMethod,
};
