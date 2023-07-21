const express = require("express");
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js");
const { checkCreateRecipeItem, checkCreateRecipeIngredient } = require("../middlewares/validates/checkCreate");
const { getDetailRecipeItem, getDetailRecipeIngredient, createRecipeItem, getAllRecipeItem, getAllRecipeIngredient, createRecipeIngredient, updateRecipeItem, updateRecipeIngredient, deleteRecipeItem, deleteRecipeIngredient, createFormIngredient, createFormItem } = require("../controllers/recipe.controllers");
const recipeRouter = express.Router();

recipeRouter.get("/item/:id_item", authenticate, authorize(["Admin","Quản lý","Nhân viên"]), getAllRecipeItem);
recipeRouter.get("/ingredient/:id_ingredient", authenticate, authorize(["Admin","Quản lý","Nhân viên"]), getAllRecipeIngredient);
recipeRouter.get("/item/detail/:id_item/:id_ingredient", authenticate, authorize(["Admin"]), getDetailRecipeItem);
recipeRouter.get("/ingredient/createform/:id_ingredient", authenticate, authorize(["Admin"]), createFormIngredient);
recipeRouter.get("/item/createform/:id_item", authenticate, authorize(["Admin"]), createFormItem);
recipeRouter.get("/ingredient/detail/:id_ingredient/:id_u_ingredient", authenticate, authorize(["Admin"]), getDetailRecipeIngredient);
recipeRouter.post("/item/create/:id_item", authenticate, authorize(["Admin"]), createRecipeItem);
recipeRouter.post("/ingredient/create/:id_ingredient", authenticate, authorize(["Admin"]), createRecipeIngredient);
recipeRouter.put("/item/update/:id_item/:id_ingredient", authenticate, authorize(["Admin"]), updateRecipeItem);
recipeRouter.put("/ingredient/update/:id_ingredient/:id_u_ingredient", authenticate, authorize(["Admin"]), updateRecipeIngredient);
recipeRouter.delete("/item/delete/:id_item/:id_ingredient", authenticate, authorize(["Admin"]), deleteRecipeItem);
recipeRouter.delete("/ingredient/delete/:id_ingredient/:id_u_ingredient", authenticate, authorize(["Admin"]), deleteRecipeIngredient);

module.exports = {
    recipeRouter,
}