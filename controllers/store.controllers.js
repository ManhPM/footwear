const { Store } = require("../models");
const { QueryTypes } = require("sequelize");

const getAllStore = async (req, res) => {
  try {
    const itemList = await Store.findAll({raw: true});
    res.status(201).render("store/store-admin",{itemList});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createForm = async (req, res) => {
  try {
    res.status(200).render("store/store-create",{flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getAllStoreForUser = async (req, res) => {
  try {
    const storeList = await Store.sequelize.query(
      "SELECT name, address, phone, email, 6371 * ACOS(COS(RADIANS(10.8477107)) * COS(RADIANS(storeLat)) * COS(RADIANS(storeLng) - RADIANS(106.78567292303907)) + SIN(RADIANS(10.8477107)) * SIN(RADIANS(storeLat))) AS distance FROM stores ORDER BY distance ASC LIMIT 0,2",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(201).json({storeList});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};



const createStore = async (req, res) => {
  const {name, phone, address, email} = req.body
  try {
    console.log(name, phone, address, email)
    await Store.create({name, phone, address, email});
    res.status(201).json({message: "Tạo mới thành công!"});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const updateStore = async (req, res) => {
  const {id_store} = req.params
  const {name, phone, address, email} = req.body
  try {
    const update = await Store.findOne({
      where: {
        id_store
      },
    });
    update.name = name
    update.phone = phone
    update.address = address
    update.email = email
    await update.save();
    const item = await Store.findOne({
      raw: true,
      where: {
        id_store
      }
    });
    res.status(200).render("store/store-create",{item, message: "Cập nhật thành công!",flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const updatePositionOfStore = async (req, res) => {
  const {storeLat, storeLng} = req.body
  const staff = await Store.sequelize.query(
    "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
    {
      replacements: { username: `${req.username}` },
      type: QueryTypes.SELECT,
      raw: true,
    }
  );
  try {
    const update = await Store.findOne({
      where: {
        id_store: staff[0].id_store
      }
    });
    update.storeLat = storeLat
    update.storeLng = storeLng
    await update.save();
    const item = await Store.findOne({
      where: {
        id_store: staff[0].id_store
      }
    });
    res.status(200).render("store/store-create",{item, message: "Cập nhật thành công!",flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getDetailStore = async (req, res) => {
  const {id_store} = req.params
  try {
    const item = await Store.findOne({
      raw: true,
      where: {
        id_store
      }
    });
    res.status(200).render("store/store-create",{item, flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

module.exports = {
    getAllStore,
    getDetailStore,
    getAllStoreForUser,
    createStore,
    updateStore,
    updatePositionOfStore,
    createForm
};
