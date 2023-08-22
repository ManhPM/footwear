const express = require("express");
const {Ingredient} = require("../models")
const { getAllIngredient, processingIngredient, createIngredient, updateIngredient, getDetailIngredient, createForm } = require("../controllers/ingredient.controllers");
const {authorize} = require("../middlewares/auth/authorize.js")
const {authenticate} = require("../middlewares/auth/authenticate.js");
const { checkCreateIngredient } = require("../middlewares/validates/checkCreate");
const Multer = require("multer");
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});
const ingredientRouter = express.Router();

ingredientRouter.get("/page/:page", authenticate, authorize(["Nhân viên","Quản lý","Admin"]), getAllIngredient);
ingredientRouter.get("/", authenticate, authorize(["Nhân viên","Quản lý","Admin"]), getAllIngredient);
ingredientRouter.get("/detail/:id_ingredient/:flag", authenticate, authorize(["Admin","Nhân viên"]), getDetailIngredient);
ingredientRouter.post("/process/:id_ingredient", authenticate, authorize(["Nhân viên","Quản lý"]), processingIngredient);
ingredientRouter.post("/create", authenticate, authorize(["Admin"]), upload.single("my_file"), checkCreateIngredient(Ingredient), createIngredient);
ingredientRouter.get("/createform", authenticate, authorize(["Admin"]), createForm);
ingredientRouter.put("/update/:id_ingredient", authenticate, authorize(["Admin"]), upload.single("my_file"), checkCreateIngredient(Ingredient), updateIngredient);


module.exports = {
    ingredientRouter,
}