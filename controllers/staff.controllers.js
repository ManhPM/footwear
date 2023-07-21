const { Staff, Account, Store, Role } = require("../models");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const getAllStaff = async (req, res) => {
  try {
    const itemList = await Staff.sequelize.query(
      "SELECT ST.name as name_store, A.username, R.name as role, S.*, DATE_FORMAT(S.birthday, '%Y-%m-%d') as datetime FROM staffs as S, roles as R, stores as ST, accounts as A WHERE ST.id_store = S.id_store AND S.id_account = A.id_account AND A.id_role != 5 AND A.id_role = R.id_role",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(201).render("staff/staff",{itemList, id_role: req.id_role});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createStaff = async (req, res) => {
  const {name, id_store, username, password, email, phone, address, description, gender, birthday} = req.body
  console.log(name, id_store, username, password, email, phone, address, description, gender, birthday);
  const {id_role} = req.body
  console.log(id_role)
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newAccount = await Account.create({
      username,
      id_role,
      password: hashPassword,
    });
    const storeList = await Store.findAll({
      raw: true,
    });
    const roleList = await Staff.sequelize.query(
      "SELECT * FROM roles WHERE id_role != 1 AND id_role != 4",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    await Staff.create({name, email, phone, address, description, gender, birthday, id_store, id_account: newAccount.id_account});
    res.status(201).render("staff/staff-create",{storeList,roleList, message: "Tạo mới thành công!", flag: 1})
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const updateStaff = async (req, res) => {
  const {id_staff} = req.params
  const {name, email, phone, address, description, gender, birthday, id_role} = req.body
  try {
    const update = await Staff.findOne({
      where: {
        id_staff
      }
    });
    update.name = name
    update.email = email
    update.phone = phone
    update.address = address
    update.description = description
    update.gender = gender
    update.birthday = birthday
    update.id_role = id_role
    await update.save();
    const item = await Staff.sequelize.query(
      "SELECT ST.name as name_store, A.username, R.name as role, S.*, DATE_FORMAT(S.birthday, '%Y-%m-%d') as datetime FROM staffs as S, roles as R, stores as ST, accounts as A WHERE ST.id_store = S.id_store AND S.id_account = A.id_account AND A.id_role != 5 AND A.id_role = R.id_role AND S.id_staff = :id_staff",
      {
        replacements: {id_staff},
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(201).render("staff/staff-create",{item: item[0],message: "Cập nhật thành công!",flag: 2})
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getDetailStaff = async (req, res) => {
  const {id_staff} = req.params
  try {
    const item = await Staff.sequelize.query(
      "SELECT ST.name as name_store, A.username, R.name as role, S.*, DATE_FORMAT(S.birthday, '%Y-%m-%d') as datetime FROM staffs as S, roles as R, stores as ST, accounts as A WHERE ST.id_store = S.id_store AND S.id_account = A.id_account AND A.id_role != 5 AND A.id_role = R.id_role AND S.id_staff = :id_staff",
      {
        replacements: {id_staff: id_staff},
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("staff/staff-create",{item:item[0], flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const createForm = async (req, res) => {
  try {
    const storeList = await Store.findAll({
      raw: true,
    });
    const roleList = await Staff.sequelize.query(
      "SELECT * FROM roles WHERE id_role != 1 AND id_role != 4",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("staff/staff-create",{storeList,roleList, flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

module.exports = {
  getAllStaff,
  getDetailStaff,
  createStaff,
  updateStaff,
  createForm
};
