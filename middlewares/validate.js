const { Account, Import, Export, Invoice } = require('../models');

function isPassword(str) {
  if (str.length >= 6) {
    return true;
  } else {
    return false;
  }
}

function isVerifyID(str) {
  if (str.length == 6) {
    return true;
  } else {
    return false;
  }
}

function isValidPhoneNumber(phoneNumber) {
  var regex = /^[0-9]{10}$/;
  if (phoneNumber.match(regex)) {
    return true;
  } else {
    return false;
  }
}
function isExist(variable) {
  if (typeof variable === 'undefined') {
    return false;
  } else {
    return true;
  }
}
function isNumber(variable) {
  if (typeof variable === 'number') {
    return true;
  } else {
    return false;
  }
}

function isPNumber(variable) {
  if (typeof variable === 'number' && variable > 0) {
    return true;
  } else {
    return false;
  }
}

const checkLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (isExist(email) && isExist(password)) {
      if (isPassword) {
        const item = await Account.findOne({
          where: {
            email,
            status: 1,
          },
        });
        if (item) {
          next();
        } else {
          res.status(400).json({
            message: 'Tài khoản không tồn tại hoặc chưa được kích hoạt',
          });
        }
      } else {
        res.status(400).json({
          message: 'Mật khẩu phải có 6 ký tự trở lên',
        });
      }
    } else {
      res.status(400).json({
        message: 'Các trường không được bỏ trống',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkRegister = async (req, res, next) => {
  try {
    const { email, phone, name, address, password } = req.body;
    if (
      isExist(email) &&
      isExist(phone) &&
      isExist(name) &&
      isExist(address) &&
      isExist(password)
    ) {
      if (isValidPhoneNumber(phone)) {
        if (isPassword(password)) {
          const item = await Account.findOne({
            where: {
              email,
              status: 1,
            },
          });
          if (!item) {
            next();
          } else {
            res.status(400).json({
              message: 'Email đăng ký đã tồn tại',
            });
          }
        } else {
          res.status(400).json({
            message: 'Mật khẩu phải có 6 ký tự trở lên',
          });
        }
      } else {
        res.status(400).json({
          message: 'Số điện thoại phải có 10 ký tự số',
        });
      }
    } else {
      res.status(400).json({
        message: 'Các trường không được bỏ trống',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkCheckOut = async (req, res, next) => {
  try {
    const { payment_method, userLat, userLng } = req.body;
    if (isExist(payment_method) && isExist(userLat) && isExist(userLng)) {
      const item = await Invoice.findOne({
        where: {
          id_customer: req.user.id_user,
          status: 0,
        },
      });
      if (!item) {
        next();
      } else {
        res.status(400).json({
          message: 'Bạn đang có đơn chưa được xác nhận không thể đặt thêm',
        });
      }
    } else {
      res.status(400).json({
        message: 'Các trường không được bỏ trống',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (isExist(email)) {
      const item = await Account.findOne({
        where: {
          email,
          status: 1,
        },
      });
      if (item) {
        next();
      } else {
        res.status(400).json({
          message: 'Tài khoản chưa được đăng ký hoặc chưa được kích hoạt',
        });
      }
    } else {
      res.status(400).json({
        message: 'Các trường không được bỏ trống',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkVerifyID = async (req, res, next) => {
  try {
    const { verifyID } = req.body;
    if (isExist(verifyID)) {
      if (isVerifyID(verifyID) && isNumber(verifyID)) {
        next();
      } else {
        res.status(400).json({
          message: 'Tài khoản chưa được đăng ký hoặc chưa được kích hoạt',
        });
      }
    } else {
      res.status(400).json({
        message: 'Các trường không được bỏ trống',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkChangePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, repeatPassword } = req.body;
    if (
      isExist(oldPassword) &&
      isExist(newPassword) &&
      isExist(repeatPassword)
    ) {
      if (
        isPassword(oldPassword) &&
        isPassword(newPassword) &&
        isPassword(repeatPassword)
      ) {
        next();
      } else {
        res.status(400).json({
          message: 'Mật khẩu phải có từ 6 ký tự trở lên',
        });
      }
    } else {
      res.status(400).json({
        message: 'Các trường không được bỏ trống',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkUpdateProfile = async (req, res, next) => {
  try {
    const { email, name, phone } = req.body;
    if (isExist(email) && isExist(name) && isExist(phone)) {
      if (isValidPhoneNumber(phone)) {
        next();
      } else {
        res.status(400).json({
          message: 'Số điện thoại phải có 10 ký tự số',
        });
      }
    } else {
      res.status(400).json({
        message: 'Các trường không được bỏ trống',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkCreateItem = async (req, res, next) => {
  try {
    const { type, name, price, size, image, brand, origin, material } =
      req.body;
    if (
      isExist(type) &&
      isExist(name) &&
      isExist(price) &&
      isExist(size) &&
      isExist(brand) &&
      isExist(origin) &&
      isExist(material) &&
      isExist(image)
    ) {
      if (isPNumber(price) && isPNumber(size)) {
        next();
      } else {
        res.status(400).json({
          message: 'Size và giá phải là số dương',
        });
      }
    } else {
      res.status(400).json({
        message: 'Các trường không được bỏ trống',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkCompleteImport = async (req, res, next) => {
  try {
    const { id_import } = req.params;
    const item = await Import.findOne({
      where: {
        id_import,
        status: 0,
      },
    });
    if (item) {
      next();
    } else {
      res.status(400).json({
        message: 'Đơn nhập không thể hoàn thành',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkCompleteExport = async (req, res, next) => {
  try {
    const { id_export } = req.params;
    const item = await Export.findOne({
      where: {
        id_export,
        status: 0,
      },
    });
    if (item) {
      next();
    } else {
      res.status(400).json({
        message: 'Đơn xuất không thể hoàn thành',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

const checkCreateReview = async (req, res, next) => {
  try {
    const { id_invoice } = req.body;
    const invoice = await Invoice.findOne({
      where: {
        id_invoice,
      },
    });
    if (invoice.status == 2) {
      next();
    } else {
      res.status(400).json({
        message: 'Đơn hàng chưa hoàn thành. Không thể đánh giá!',
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Middleware Error!', error: error.message });
  }
};

module.exports = {
  checkLogin,
  checkRegister,
  checkCheckOut,
  checkForgotPassword,
  checkVerifyID,
  checkChangePassword,
  checkUpdateProfile,
  checkCreateItem,
  checkCompleteExport,
  checkCompleteImport,
  checkCreateReview,
};
