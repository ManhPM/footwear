const { Unprocessed_ingredient, Store, Unprocessed_ingredient_store } = require("../models");
const { QueryTypes } = require("sequelize");
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

const getAllUnprocessedIngredient = async (req, res) => {
  const {name} = req.query
  try {
    const perPage = 12;
    const page = req.params.page || 1;
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
          "SELECT UI.* FROM unprocessed_ingredients as UI LIMIT :from,:perPage",
          {
            replacements: {
              from: (page - 1) * perPage,
              perPage: perPage,
            },
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
          "SELECT UI.*, US.quantity FROM unprocessed_ingredients as UI, unprocessed_ingredient_stores as US WHERE US.id_store = :id_store AND US.id_u_ingredient = UI.id_u_ingredient LIMIT :from,:perPage",
          {
            replacements: {
              id_store: staff[0].id_store,
              from: (page - 1) * perPage,
              perPage: perPage,
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
    const unprocessed_ingredient = await Unprocessed_ingredient.create({
      name,
      unit,
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
