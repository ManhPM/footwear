const express = require("express");
const {Item} = require("../models")
const {authenticate} = require("../middlewares/auth/authenticate.js")
const {authorize} = require("../middlewares/auth/authorize.js")
const {getAllItem, getDetailItem, createItem, updateItem, deleteItem, get3ItemsEachType, getItems, processingItem, getTopping, getAllItemInStore, createForm, processForm, getDetailItemUser} = require("../controllers/item.controllers");
const { checkCreateItem, checkItemValue } = require("../middlewares/validates/checkCreate.js");
const Multer = require("multer");
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});
const itemRouter = express.Router();

itemRouter.get("/page/:page", getAllItem);
itemRouter.get("/", getAllItem);
itemRouter.get("/store/page/:page", authenticate, authorize(["Quản lý","Nhân viên","Admin"]), getAllItemInStore);
itemRouter.get("/store", authenticate, authorize(["Quản lý","Nhân viên","Admin"]), getAllItemInStore);
itemRouter.get("/get", getItems);
itemRouter.get("/createform", authenticate, authorize(["Admin"]), createForm);
itemRouter.get("/processform/:id_item", authenticate, authorize(["Nhân viên","Quản lý"]), processForm);
itemRouter.get("/topping", getTopping);
itemRouter.get("/category", get3ItemsEachType);
itemRouter.get("/detail/user/:id_item", getDetailItemUser);
itemRouter.get("/detail/:id_item", getDetailItem);
itemRouter.post("/create", authenticate, authorize(["Admin"]), upload.single("my_file"), checkCreateItem(Item), checkItemValue(Item), createItem);
itemRouter.put("/update/:id_item", authenticate, authorize(["Admin"]), upload.single("my_file"), checkItemValue(Item), checkCreateItem(Item), updateItem);
itemRouter.delete("/delete/:id_item", authenticate, authorize(["Admin"]), deleteItem);
itemRouter.post("/:id_item", authenticate, authorize(["Nhân viên","Quản lý"]), processingItem);

module.exports = {
    itemRouter,
}