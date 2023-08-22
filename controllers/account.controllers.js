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
  const { id_shipping_partner } = req.params;
  const { username, password, name, email, phone, address, description } =
    req.body;
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
    const item = await Shipper.findOne({
      where: {
        id_account: newAccount.id_account,
      },
      raw: true,
    });
    res.status(200).render("shipper/shipper-create", {
      message: "Đăng ký thành công!",
      flag: 1,
      item,
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
    const token = jwt.sign(
      { username: account.username, id_role: account.id_role },
      "manhpham2k1",
      {
        expiresIn: 15 * 24 * 60 * 60,
      }
    );
    if (account.id_role == 1) {
      const customer = await Customer.findOne({
        where: {
          id_account: account.id_account,
        },
      });
      const refreshToken = jwt.sign(
        { username: account.username, id_role: account.id_role  },
        "manhpham2k1",
        {
          expiresIn: 30 * 24 * 60 * 60,
        }
      );
      res.status(200).json({
        message: "Đăng nhập thành công!",
        token,
        refreshToken,
        userInfo: customer,
        expireTimeToken: 15 * 60 * 60 * 24,
        expireTimeRefreshToken: 30 * 60 * 60 * 24,
        id_role: account.id_role,
      });
    } else if (account.id_role == 3 || account.id_role == 4) {
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .render("account/loginsucced", {
          role: 3,
        });
    } else if (account.id_role == 2) {
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .render("account/loginsucced", {
          role: 2,
        });
    } else {
      res
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .render("account/loginsucced", {
          role: 5,
        });
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
    if (req.id_role == 4) {
      const customer = await Account.sequelize.query(
        `SELECT CU.*, A.username, R.name as role, SP.name as name_shipping_partner FROM shippers as CU, accounts as A, shipping_partners as SP, roles as R WHERE A.id_account = CU.id_account AND A.username = :username AND A.id_role = R.id_role AND CU.id_shipping_partner = SP.id_shipping_partner`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            username: `${req.username}`,
          },
          raw: true,
        }
      );
      res.status(200).render("account/profile", {
        userInfo: customer[0],
        id_role: req.id_role
      });
    }
    else if(req.id_role == 1){
      const customer = await Account.sequelize.query(
        "SELECT CU.*, A.username, R.name as role FROM customers as CU, accounts as A, roles as R WHERE A.id_account = CU.id_account AND A.username = :username AND A.id_role = R.id_role",
        {
          type: QueryTypes.SELECT,
          replacements: {
            username: `${req.username}`,
          },
          raw: true,
        }
      );
      res.status(200).json({
        userInfo: customer[0],
      });
    }
    else{
      const customer = await Account.sequelize.query(
        `SELECT CU.*, A.username, R.name as role FROM staffs as CU, accounts as A, roles as R WHERE A.id_account = CU.id_account AND A.username = :username AND A.id_role = R.id_role`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            username: `${req.username}`,
          },
          raw: true,
        }
      );
      res.status(200).render("account/profile", {
        userInfo: customer[0],
        flag: 1,
        id_role: req.id_role
      });
    }
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

const changePasswordUser = async (req, res) => {
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
          res.status(400).json({
            message: "Mật khẩu mới không được giống với mật khẩu cũ!",
          });
        } else {
          //tạo ra một chuỗi ngẫu nhiên
          const salt = bcrypt.genSaltSync(10);
          //mã hoá salt + password
          const hashPassword = bcrypt.hashSync(newPassword, salt);
          accountUpdate.password = hashPassword;
          await accountUpdate.save();
          res.status(201).json({
            message: "Đổi mật khẩu thành công!",
          });
        }
      } else {
        res.status(400).json({
          message: "Mật khẩu lặp lại không đúng!",
        });
      }
    } else {
      res.status(400).json({
        message: "Mật khẩu không chính xác!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Thao tác thất bại!",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { username, email } = req.body;
  try {
      const account = await Account.sequelize.query(
        "SELECT CU.email, A.* FROM customers as CU, accounts as A WHERE A.id_account = CU.id_account AND A.username = :username",
        {
          type: QueryTypes.SELECT,
          replacements: {
            username: username,
          },
        }
      )
      if(account[0].username == username && account[0].email == email){
        const randomPassword = (Math.random() + 1).toString(36).substring(2);
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(randomPassword, salt);
        await Account.sequelize.query(
          "UPDATE accounts SET password = :password WHERE username = :username",
          {
            type: QueryTypes.UPDATE,
            replacements: {
              password: hashPassword,
              username
            },
          }
        );
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "n19dccn107@student.ptithcm.edu.vn", // generated ethereal user
            pass: "dzwedtbaoqsmrkob", // generated ethereal password
          },
        });
        // send mail with defined transport object
        await transporter.sendMail({
          from: "P2M MILKTEA SECURITY", // sender address
          to: `${account[0].email}`, // list of receivers
          subject: "Lấy lại mật khẩu", // Subject line
          text: "Lấy lại mật khẩu", // plain text body
          html: `<div>P2M Milktea.</div>
          <div>Lấy lại mật khẩu mới.</div>
          <br>
          <div>
            <div>Mật khẩu mới của bạn là: <span style="color:blue;">${randomPassword}</span></div>
          </div>
          <br>
          <div>
            <div>97 Man Thiện Phường Hiệp Phú Thành phố Thủ Đức</div>
          </div>
          `, // htm, // html body
        });
        res.status(200).json({
          message: `Mật khẩu mới đã được gửi về email vui lòng kiểm tra hòm thư!`,
        });
      }
      else{
        res.status(400).json({
          message: `Thông tin chưa chính xác!`,
        });
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
  changePasswordUser
};
