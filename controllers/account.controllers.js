const {
  Account,
  Shipper,
  Customer,
  Wishlist,
  Cart,
  Staff,
} = require("../models");
const { QueryTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const createAccountForCustomer = async (req, res) => {
  const { username, password, name, email, phone, address } = req.body;
  try {
    //tạo ra một chuỗi ngẫu nhiên
    const salt = bcrypt.genSaltSync(10);
    //mã hoá salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    const newAccount = await Account.create({
      username,
      id_role: 1,
      password: hashPassword,
    });
    const customer = await Customer.findOne({
      where: {
        email,
      },
    });
    if (customer) {
      customer.id_account = newAccount.id_account;
      await customer.save();

      await Cart.create({
        id_customer: customer.id_customer,
      });

      await Wishlist.create({
        id_customer: customer.id_customer,
      });
    } else {
      const newCustomer = await Customer.create({
        id_account: newAccount.id_account,
        name,
        email,
        phone,
        address,
      });
      await Cart.create({
        id_customer: newCustomer.id_customer,
      });
      await Wishlist.create({
        id_customer: newCustomer.id_customer,
      });
      res.status(200).json({
        message: "Đăng ký thành công!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Đăng ký thất bại!",
    });
  }
};

const createAccountForShipper = async (req, res) => {
  const {
    username,
    password,
    name,
    email,
    phone,
    address,
    id_shipping_partner,
    description,
  } = req.body;
  try {
    //tạo ra một chuỗi ngẫu nhiên
    const salt = bcrypt.genSaltSync(10);
    //mã hoá salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    const newAccount = await Account.create({
      username,
      id_role: 4,
      password: hashPassword,
    });
    await Shipper.create({
      id_account: newAccount.id_account,
      name,
      email,
      phone,
      address,
      description,
      id_shipping_partner,
    });
    res.status(200).json({
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Đăng ký thất bại!",
    });
  }
};

const createAccountForStaff = async (req, res) => {
  const {
    username,
    password,
    name,
    gender,
    email,
    phone,
    address,
    birthday,
    description,
    id_store,
  } = req.body;
  try {
    //tạo ra một chuỗi ngẫu nhiên
    const salt = bcrypt.genSaltSync(10);
    //mã hoá salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    const newAccount = await Account.create({
      username,
      id_role: 3,
      password: hashPassword,
    });
    await Staff.create({
      id_account: newAccount.id_account,
      id_store,
      name,
      gender,
      email,
      phone,
      address,
      birthday,
      description,
    });
    res.status(200).json({
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Đăng ký thất bại!",
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const account = await Account.findOne({
    where: {
      username,
    },
  });
  const isAuth = bcrypt.compareSync(password, account.password);
  if (isAuth) {
    const token = jwt.sign({ username: account.username }, "manhpham2k1", {
      expiresIn: 15 * 24 * 60 * 60,
    });
    if (account.id_role == 1) {
      const customer = await Account.sequelize.query(
        "SELECT CU.*, A.username, R.name as role FROM roles as R, customers as CU, accounts as A WHERE A.id_account = CU.id_account AND A.username = :username AND A.id_role = R.id_role",
        {
          type: QueryTypes.SELECT,
          replacements: {
            username,
          },
        }
      );
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .render("account/profile", {
          username: customer[0].username,
          image: customer[0].image,
          name: customer[0].name,
          role: customer[0].role,
          address: customer[0].address,
          phone: customer[0].phone,
          email: customer[0].email,
        });
    } else if (account.id_role == 3 || account.id_role == 4) {
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .render("order/order");
    } else if (account.id_role == 2) {
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .render("order/dashboard-manager");
    } else {
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .render("order/dashboard-admin");
    }
  } else {
    res
      .status(400)
      .render("account/signin", { message: "Sai thông tin đăng nhập!" });
  }
};

const logout = async (req, res, next) => {
  res.clearCookie("access_token").status(200).render("account/signin");
};

const getUserInfo = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: {
        username: req.username,
      },
    });
    const customer = await Customer.findOne({
      where: {
        id_account: account.id_account,
      },
    });
    res.status(200).json({
      userInfo: customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lấy thông tin user thất bại!",
    });
  }
};

const edit = async (req, res) => {
  res.status(200).render("account/edit");
};

const refreshToken = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: {
        username: req.username,
      },
    });
    const token = jwt.sign({ username: account.username }, "manhpham2k1", {
      expiresIn: 15 * 24 * 60 * 60,
    });
    const refreshToken = jwt.sign(
      { username: account.username },
      "manhpham2k1",
      {
        expiresIn: 30 * 24 * 60 * 60,
      }
    );
    res.status(200).json({
      message: "Refresh token thành công!",
      token,
      refreshToken,
      expireTimeToken: 15 * 60 * 60 * 24,
      expireTimeRefreshToken: 30 * 60 * 60 * 24,
    });
  } catch (error) {
    res.status(500).json({
      message: "Refresh token thất bại!",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const account = await Account.findOne({
      where: {
        username: req.username,
      },
    });
    await Account.sequelize.query(
      "UPDATE customers SET name = :name, phone = :phone, address = :address WHERE id_account = :id_account",
      {
        replacements: {
          name: `${name}`,
          phone: `${phone}`,
          address: `${address}`,
          id_account: account.id_account,
        },
        type: QueryTypes.UPDATE,
        raw: true,
      }
    );
    res.status(200).json({ message: "Cập nhật thông tin thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Cập nhật thông tin thất bại!" });
  }
};

const uploadAvatar = async (req, res) => {
  const { image } = req.body;
  try {
    const account = await Account.findOne({
      where: {
        username: req.username,
      },
    });
    const update = await Customer.findOne({
      where: {
        id_account: account.id_account,
      },
    });
    console.log("cc");
    update.image = image;
    await update.save();
    res.status(200).json({ message: "Cập nhật ảnh đại diện thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, repeatPassword } = req.body;
  try {
    const accountUpdate = await Account.findOne({
      where: {
        username: req.username,
      },
    });
    const isAuth = bcrypt.compareSync(oldPassword, accountUpdate.password);
    if (isAuth) {
      if (newPassword == repeatPassword) {
        if (newPassword == oldPassword) {
          res.status(400).render("account/edit", {
            message: "Mật khẩu mới không được giống với mật khẩu cũ!",
          });
        } else {
          //tạo ra một chuỗi ngẫu nhiên
          const salt = bcrypt.genSaltSync(10);
          //mã hoá salt + password
          const hashPassword = bcrypt.hashSync(newPassword, salt);
          accountUpdate.password = hashPassword;
          await accountUpdate.save();
          res.clearCookie("access_token").status(201).render("account/signin", {
            message: "Đổi mật khẩu thành công!",
          });
        }
      } else {
        res.status(400).render("account/edit", {
          message: "Mật khẩu lặp lại không đúng!",
        });
      }
    } else {
      res.status(400).render("account/edit", {
        message: "Mật khẩu không chính xác!",
      });
    }
  } catch (error) {
    res.status(500).render("account/edit", {
      message: "Thao tác thất bại!",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { username } = req.body;
  try {
    const randomID = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    const isExist = await Account.findOne({
      where: {
        forgot: randomID,
      },
    });
    if (isExist !== null) {
      res.status(400).json({
        message: `Có lỗi xảy ra vui lòng thử lại!`,
      });
    } else {
      const account = await Account.sequelize.query(
        "SELECT CU.email, A.* FROM customers as CU, accounts as A WHERE A.id_account = CU.id_account AND A.username = :username AND A.",
        {
          type: QueryTypes.SELECT,
          replacements: {
            username: username,
          },
        }
      );
      if (account[0].isActive == 0) {
        res.status(400).json({
          message: `Địa chỉ email chưa được xác minh!`,
        });
      } else {
        await Account.sequelize.query(
          "UPDATE accounts SET forgot = :randomID WHERE username = :username",
          {
            type: QueryTypes.UPDATE,
            replacements: {
              randomID: randomID,
              username: username,
            },
          }
        );
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "n19dccn107@student.ptithcm.edu.vn", // generated ethereal user
            pass: "bqztpfkmmbpzmdxl", // generated ethereal password
          },
        });
        // send mail with defined transport object
        await transporter.sendMail({
          from: "n19dccn107@student.ptithcm.edu.vn", // sender address
          to: `${account[0].email}`, // list of receivers
          subject: "FORGOT PASSWORD", // Subject line
          text: "FORGOT PASSWORD", // plain text body
          html: `Mã xác nhận của bạn là: ${randomID}`, // html body
        });
        var s2 = account[0].email;
        var s1 = s2.substring(0, s2.length - 15);
        var s3 = s2.substring(s2.length - 15, s2.length);
        var email = s1 + s3.replace(/\S/gi, "*");
        res.status(200).json({
          message: `Mã xác minh đã được gửi về email: ${email} vui lòng kiểm tra hòm thư!`,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res, next) => {
  const { verifyID, username } = req.body;
  const account = await Account.findOne({
    where: {
      forgot: verifyID,
      username,
    },
    raw: true,
  });
  if (account) {
    res.status(200).json({
      message: `Mã xác nhận chính xác!`,
      isSuccess: true,
    });
  } else {
    res.status(400).json({
      message: `Mã xác nhận không chính xác!`,
      isSuccess: false,
    });
  }
};

const accessForgotPassword = async (req, res, next) => {
  const { username, password, repeatPassword } = req.body;
  if (password != repeatPassword) {
    res.status(400).json({
      message: `Mật khẩu lặp lại không chính xác!`,
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    //mã hoá salt + password
    const hashPassword = bcrypt.hashSync(password, salt);
    try {
      const accountUpdate = await Account.findOne({
        where: {
          username,
        },
      });
      accountUpdate.password = hashPassword;
      accountUpdate.forgot = 0;
      if (accountUpdate.active == 0) {
        accountUpdate.active = 1;
      }
      await accountUpdate.save();
      res.status(200).json({
        message: `Lấy lại mật khẩu thành công!`,
      });
    } catch (error) {
      res.status(500).json({
        message: `Lấy lại mật khẩu thất bại!`,
      });
    }
  }
};

module.exports = {
  login,
  changePassword,
  forgotPassword,
  verify,
  accessForgotPassword,
  createAccountForShipper,
  createAccountForCustomer,
  createAccountForStaff,
  refreshToken,
  uploadAvatar,
  updateProfile,
  getUserInfo,
  logout,
  edit,
};
