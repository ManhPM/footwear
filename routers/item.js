const express = require("express");
const {
  createItem,
  deleteItem,
  getAllItem,
  getAllItemToImport,
  getDetailItem,
  updateItem,
  sanPhamLienQuan,
  bookRecommendationCF,
  bookRecommendationSVM,
} = require("../controllers/itemController");
const { authenticate, authorize } = require("../middlewares/auth");
const { checkCreateItem } = require("../middlewares/checkCreate");
const {
  checkExistItem,
  checkExistImportInvoice,
} = require("../middlewares/checkExist");

const itemRouter = express.Router();

itemRouter.get("/", getAllItem);
itemRouter.get("/cfrecommendation", authenticate, bookRecommendationCF);
itemRouter.post("/svmrecommendation", bookRecommendationSVM);
itemRouter.get("/sanphamlienquan/:id_item", checkExistItem, sanPhamLienQuan);
itemRouter.get(
  "/import/:id_i_invoice",
  checkExistImportInvoice,
  getAllItemToImport
);
itemRouter.get("/detail/:id_item", checkExistItem, getDetailItem);
itemRouter.post(
  "/create",
  authenticate,
  authorize(["Admin"]),
  checkCreateItem,
  createItem
);
itemRouter.put(
  "/update/:id_item",
  authenticate,
  authorize(["Admin"]),
  checkExistItem,
  updateItem
);
itemRouter.delete(
  "/delete/:id_item",
  authenticate,
  authorize(["Admin"]),
  checkExistItem,
  deleteItem
);

module.exports = {
  itemRouter,
};
