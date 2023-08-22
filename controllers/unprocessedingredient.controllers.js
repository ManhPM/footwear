const { Unprocessed_ingredient, Store, Unprocessed_ingredient_store } = require("../models");
const { QueryTypes } = require("sequelize");
const cloudinary = require("cloudinary").v2;    

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

const getAllUnprocessedIngredient = async (req, res) => {
  try {
    const staff = await Unprocessed_ingredient.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if(req.id_role == 5){
        const totalItems = await Unprocessed_ingredient.sequelize.query(
          "SELECT COUNT(*) as total FROM unprocessed_ingredients",
          {
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        const itemList = await Unprocessed_ingredient.sequelize.query(
          "SELECT UI.* FROM unprocessed_ingredients as UI",
          {
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(201).render("unprocessed-ingredient/unprocessed-ingredient-admin",{totalItems: totalItems[0].total, itemList, id_role: req.id_role});
    }
    else {
        const totalItems = await Unprocessed_ingredient.sequelize.query(
          "SELECT COUNT(*) as total FROM unprocessed_ingredients",
          {
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        const itemList = await Unprocessed_ingredient.sequelize.query(
          "SELECT UI.*, US.quantity FROM unprocessed_ingredients as UI, unprocessed_ingredient_stores as US WHERE US.id_store = :id_store AND US.id_u_ingredient = UI.id_u_ingredient",
          {
            replacements: {
              id_store: staff[0].id_store,
            },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(201).render("unprocessed-ingredient/unprocessed-ingredient",{totalItems: totalItems[0].total, itemList, id_role: req.id_role});
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createUnprocessedIngredient= async (req, res) => {
  const {name, unit} = req.body
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    const unprocessed_ingredient = await Unprocessed_ingredient.create({
      name,
      unit,
      image: cldRes.url
    });
    const store = await Store.findAll({
    })
    let i = 0
    while(store[i]){
      await Unprocessed_ingredient_store.create({
        id_u_ingredient: unprocessed_ingredient.id_u_ingredient,
        id_store: store[i].id_store,
        quantity: 0
      })
      i++
    }
    res.status(200).render("unprocessed-ingredient/unprocessed-ingredient-create",{message: "Tạo mới thành công!", flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const updateUnprocessedIngredient= async (req, res) => {
  const {id_u_ingredient} = req.params
  const {name, unit} = req.body
  try {
    const update = await Unprocessed_ingredient.findOne({
      where: {
        id_u_ingredient
      }
    })
    if(req.file){
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      update.image = cldRes.url;
    }
    update.name = name
    update.unit = unit
    await update.save();
    const item = await Unprocessed_ingredient.findOne({
      raw: true,
      where: {
        id_u_ingredient
      }
    });
    res.status(200).render("unprocessed-ingredient/unprocessed-ingredient-create",{item ,message: "Cập nhật thành công!", flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getDetailUnprocessedIngredient = async (req, res) => {
  const {id_u_ingredient} = req.params
  try {
    const item = await Unprocessed_ingredient.findOne({
      raw: true,
      where: {
        id_u_ingredient
      }
    });
    res.status(200).render("unprocessed-ingredient/unprocessed-ingredient-create",{item, flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const createForm = async (req, res) => {
  try {
    res.status(200).render("unprocessed-ingredient/unprocessed-ingredient-create",{flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};


module.exports = {
    getAllUnprocessedIngredient,
    createUnprocessedIngredient,
    updateUnprocessedIngredient,
    getDetailUnprocessedIngredient,
    createForm
};
