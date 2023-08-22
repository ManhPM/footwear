const { Store } = require("../models");
const { QueryTypes } = require("sequelize");

const cloudinary = require("cloudinary").v2;    

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

const getAllStore = async (req, res) => {
  try {
    const itemList = await Store.findAll({raw: true});
    res.status(201).render("store/store-admin",{itemList, id_role: req.id_role});
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
  const {name, phone, address, email, storeLng, storeLat} = req.body
  try {
    console.log(req.file)
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    await Store.create({name, phone, address, email, storeLng, storeLat, image: cldRes.url});
    res
      .status(201)
      .render("store/store-create", {
        message: "Tạo mới thành công!",
        flag: 1,
      });
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const updateStore = async (req, res) => {
  const {id_store} = req.params
  const {name, phone, address, email, storeLng, storeLat} = req.body
  try {
    const update = await Store.findOne({
      where: {
        id_store
      },
    });
    if(req.file){
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      update.image = cldRes.url;
    }
    update.name = name
    update.phone = phone
    update.address = address
    update.email = email
    update.storeLng = storeLng
    update.storeLat = storeLat
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
