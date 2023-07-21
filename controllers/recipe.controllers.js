const { Recipe, Recipe_ingredient, Item, Ingredient, Unprocessed_ingredient } = require("../models");
const { QueryTypes } = require("sequelize");

const createRecipeItem = async (req, res) => {
  const {id_item} = req.params
  const { id_ingredient, quantity } = req.body;
  try {
    await Recipe.create({
        id_ingredient, id_item, quantity 
    });
    const ingredientList = await Recipe.sequelize.query(
      "SELECT * FROM ingredients WHERE id_ingredient NOT IN(SELECT id_ingredient FROM recipes WHERE id_item = :id_item)",
      {
        replacements: { id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const item = await Item.findOne({
      raw: true,
      where:{
        id_item
      }
    });
    res.status(201).render("recipe/recipe-item-create",{ingredientList,item,message: "Tạo mới thành công!", flag: 1})
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllRecipeItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const itemList = await Recipe.sequelize.query(
      "SELECT roles.id_role, R.*, IG.name, IG.image, IG.unit FROM roles, recipes as R, items as I, ingredients as IG WHERE R.id_item = I.id_item AND R.id_ingredient = IG.id_ingredient AND I.id_item = :id_item AND roles.id_role = :id_role",
      {
        replacements: { id_item, id_role: req.id_role },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if(req.id_role != 5){
      res.status(200).render("recipe/recipe-item",{ itemList, id_item, flag: 1, id_role: req.id_role});
    }
    else{
      res.status(200).render("recipe/recipe-item",{ itemList, id_item, flag: 2, id_role: req.id_role});
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const updateRecipeItem = async (req, res) => {
  const { id_ingredient, id_item } = req.params;
  const { quantity } = req.body;
  try {
      await Recipe.sequelize.query(
        "UPDATE recipes SET quantity = :quantity WHERE id_item = :id_item AND id_ingredient = :id_ingredient",
        {
          replacements: { id_item, id_ingredient, quantity },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      const item = await Recipe.findOne({
        raw: true,
        where: {
          id_ingredient,
          id_item,
        }
      });
      res.status(201).render("recipe/recipe-item-create",{item,message: "Cập nhật thành công!",flag: 2})
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const deleteRecipeItem = async (req, res) => {
  const { id_ingredient, id_item } = req.params;
  try {
      await Recipe.destroy({
        where: {
          id_ingredient,
          id_item,
        },
      });
      res.status(201).render("recipe/recipe-notification",{id_item,message: "Xoá thành công!",flag: 1})
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getDetailRecipeItem = async (req, res) => {
  const { id_ingredient, id_item } = req.params;
  try {
    const item = await Recipe.findOne({
      raw: true,
      where: {
        id_ingredient,
        id_item
      }
    })
    const itemList = await Item.findAll({
      raw: true,
    });
    const ingredientList = await Ingredient.findAll({
      raw: true,
    });
    res.status(200).render("recipe/recipe-item-create",{item,itemList,ingredientList, flag: 2});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createRecipeIngredient = async (req, res) => {
  const {id_ingredient} = req.params
  const { id_u_ingredient, quantity } = req.body;
  try {
    await Recipe_ingredient.create({
        id_ingredient, id_u_ingredient, quantity 
    });
    const unprocessedingredientList = await Recipe.sequelize.query(
      "SELECT * FROM unprocessed_ingredients WHERE id_u_ingredient NOT IN(SELECT id_u_ingredient FROM recipe_ingredients WHERE id_ingredient = :id_ingredient)",
      {
        replacements: { id_ingredient },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const item = await Ingredient.findOne({
      raw: true,
      where:{
        id_ingredient
      }
    });
    res.status(201).render("recipe/recipe-ingredient-create",{item,unprocessedingredientList,message: "Tạo mới thành công!", flag: 1})
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllRecipeIngredient = async (req, res) => {
  const { id_ingredient } = req.params;
  try {
    const itemList = await Recipe.sequelize.query(
      "SELECT RI.*, UI.name, UI.image, UI.unit, R.id_role FROM roles as R, recipe_ingredients as RI, ingredients as IG, unprocessed_ingredients as UI WHERE UI.id_u_ingredient = RI.id_u_ingredient AND RI.id_ingredient = IG.id_ingredient AND IG.id_ingredient = :id_ingredient AND R.id_role = :id_role",
      {
        replacements: { id_ingredient, id_role: req.id_role },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if(req.id_role != 5){
      res.status(200).render("recipe/recipe-ingredient",{ itemList, id_ingredient, flag: 2, id_role: req.id_role});
    }
    else{
      res.status(200).render("recipe/recipe-ingredient",{ itemList, id_ingredient, flag: 1, id_role: req.id_role});
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const updateRecipeIngredient = async (req, res) => {
  const { id_ingredient, id_u_ingredient } = req.params;
  const { quantity } = req.body;
  try {
      await Recipe_ingredient.sequelize.query(
        "UPDATE recipe_ingredients SET quantity = :quantity WHERE id_u_ingredient = :id_u_ingredient AND id_ingredient = :id_ingredient",
        {
          replacements: { id_u_ingredient, id_ingredient, quantity },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      const item = await Recipe_ingredient.findOne({
        raw: true,
        where: {
          id_ingredient, id_u_ingredient
        },
      });
      res.status(201).render("recipe/recipe-ingredient-create",{item,message: "Cập nhật thành công!",flag: 2})
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const deleteRecipeIngredient = async (req, res) => {
  const { id_ingredient, id_u_ingredient } = req.params;
  try {
      await Recipe_ingredient.destroy({
        where: {
          id_ingredient,
          id_u_ingredient,
        },
      });
      res.status(201).render("recipe/recipe-notification",{id_ingredient,message: "Xoá thành công!",flag: 2})
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getDetailRecipeIngredient = async (req, res) => {
  const { id_ingredient, id_u_ingredient } = req.params;
  try {
    const item = await Recipe_ingredient.findOne({
      raw: true,
      where: {
        id_ingredient,
        id_u_ingredient
      }
    })
    const unprocessedingredientList = await Unprocessed_ingredient.findAll({
      raw: true,
    });
    const ingredientList = await Ingredient.findAll({
      raw: true,
    });
    res.status(200).render("recipe/recipe-ingredient-create",{item,unprocessedingredientList,ingredientList, flag: 2});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createFormItem = async (req, res) => {
  const {id_item} = req.params
  try {
    const ingredientList = await Recipe.sequelize.query(
      "SELECT * FROM ingredients WHERE id_ingredient NOT IN(SELECT id_ingredient FROM recipes WHERE id_item = :id_item)",
      {
        replacements: { id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const item = await Item.findOne({
      raw: true,
      where:{
        id_item
      }
    });
    res.status(200).render("recipe/recipe-item-create",{item, ingredientList,flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};
const createFormIngredient = async (req, res) => {
  const {id_ingredient} = req.params
  try {
    const unprocessedingredientList = await Recipe.sequelize.query(
      "SELECT * FROM unprocessed_ingredients WHERE id_u_ingredient NOT IN(SELECT id_u_ingredient FROM recipe_ingredients WHERE id_ingredient = :id_ingredient)",
      {
        replacements: { id_ingredient },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const item = await Ingredient.findOne({
      raw: true,
      where:{
        id_ingredient
      }
    });
    res.status(200).render("recipe/recipe-ingredient-create",{item, unprocessedingredientList,flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

module.exports = {
    createRecipeItem,
    updateRecipeItem,
    deleteRecipeItem,
    getDetailRecipeItem,
    createRecipeIngredient,
    updateRecipeIngredient,
    deleteRecipeIngredient,
    getDetailRecipeIngredient,
    getAllRecipeItem,
    getAllRecipeIngredient,
    createFormItem,
    createFormIngredient
};  
