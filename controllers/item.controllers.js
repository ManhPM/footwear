const { Item, Store, Item_store, Type } = require("../models");
const { QueryTypes } = require("sequelize");
const cloudinary = require("cloudinary").v2;    

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}
const createItem = async (req, res) => {
  const { id_type, image, name, price } = req.body;
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    const item = await Item.create({
      id_type,
      image: cldRes.url,
      name,
      price,
      status: 1,
    });
    const store = await Store.findAll({});
    let i = 0;
    while (store[i]) {
      await Item_store.create({
        id_item: item.id_item,
        id_store: store[i].id_store,
        quantity: 0,
      });
      i++;
    }
    res
      .status(201)
      .render("item/item-create", { message: "Tạo mới thành công!", flag: 1 });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const updateItem = async (req, res) => {
  const { id_item } = req.params;
  const { name, price } = req.body;
  try {
    const update = await Item.findOne({
      where: {
        id_item,
      },
    });
    if(req.file){
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      update.image = cldRes.url;
    }
    update.name = name;
    update.price = price;
    await update.save();
    const item = await Item.findOne({
      raw: true,
      where: {
        id_item,
      },
    });
    res.status(201).render("item/item-create", {
      item,
      message: "Cập nhật thành công!",
      flag: 2,
    });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const deleteItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const check = await Item.sequelize.query(
      "SELECT COUNT(O.id_order) as count FROM orders as O, order_details as OD, items as I WHERE I.id_item = OD.id_item AND OD.id_order = O.id_order AND I.id_item = :id_item AND O.status != 1 AND O.status != 2",
      {
        replacements: { id_item: id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if (check[0].count == 0) {
      const itemUpdate = await Item.findOne({
        where: {
          id_item,
        },
      });
      if (itemUpdate.status == 0) {
        itemUpdate.status = 1;
        await itemUpdate.save();
        res.status(200).render("item/item-notification", {
          message: "Sản phẩm đã có thể kinh doanh!",
        });
      } else {
        itemUpdate.status = 0;
        await itemUpdate.save();
        res.status(200).render("item/item-notification", {
          message: "Xoá sản phẩm thành công!",
        });
      }
    } else {
      res.status(400).json({
        message: "Xoá sản phẩm thất bại. Còn hoá đơn đang hoạt động!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllItemInStore = async (req, res) => {
  try {
    if (req.id_role == 5) {
      // gia giam dan
      const itemList = await Item.sequelize.query(
        "SELECT I.*, T.name AS name_type FROM items as I, types as T WHERE T.id_type = I.id_type ORDER BY I.price DESC ",
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).render("item/item-admin", {
        itemList,
        id_role: req.id_role,
      });
    } else {
      const staff = await Item.sequelize.query(
        "SELECT S.*, A.id_role FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
        {
          replacements: { username: `${req.username}` },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      // gia giam dan
      const itemList = await Item.sequelize.query(
        "SELECT I.*, T.name AS name_type, SI.quantity FROM items as I, types as T, item_stores as SI WHERE T.id_type = I.id_type AND I.id_item = SI.id_item AND SI.id_store = :id_store ORDER BY I.price DESC",
        {
          replacements: {
            id_store: staff[0].id_store,
          },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).render("item/item-staff", {
        itemList,
        id_role: req.id_role,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllItem = async (req, res) => {
  const { id_type } = req.query;
  try {
      if (id_type) {
        const itemList = await Item.sequelize.query(
          "SELECT I.id_item, I.id_type, I.name, I.image, FORMAT(I.price, 0) as price, T.name as name_type, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 AND T.id_type = :id_type ORDER BY I.price ASC",
          {
            replacements: {
              id_type: id_type,
            },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ itemList });
      } 
      else {
        const itemList = await Item.sequelize.query(
          "SELECT I.*, T.name as name_type, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 ORDER BY I.price ASC",
          {
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ itemList });
      }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getDetailItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const item = await Item.sequelize.query(
      "SELECT I.*, T.name as name_type FROM items AS I, types as T WHERE T.id_type = I.id_type AND I.id_item = :id_item",
      {
        replacements: { id_item: id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("item/item-create", { item: item[0], flag: 2 });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getDetailItemUser = async (req, res) => {
  const { id_item } = req.params;
  try {
    const item = await Item.sequelize.query(
      "SELECT I.id_item, I.id_type, I.name, I.image, FORMAT(I.price, 0) as price, T.name as name_type, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items AS I, types as T WHERE T.id_type = I.id_type AND I.id_item = :id_item",
      {
        replacements: { id_item: id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({ item });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const get3ItemsEachType = async (req, res) => {
  try {
    const itemsEachType = await Item.sequelize.query(
      "SELECT * FROM (SELECT I.*, T.name AS name_type, row_number() over (partition by I.id_type) as type_rank FROM items as I, types as T WHERE I.id_type = T.id_type AND T.id_type != 4 ORDER BY I.price ASC) test WHERE type_rank <= 3",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json(itemsEachType);
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getItems = async (req, res) => {
  const { quantity } = req.query;
  try {
    const items = await Item.sequelize.query(
      "SELECT I.*, T.name FROM items as I, types as T WHERE I.id_type = T.id_type AND T.id_type != 4 ORDER BY I.price ASC LIMIT :quantity",
      {
        replacements: { quantity: Number(quantity) },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getTopping = async (req, res) => {
  try {
    const itemList = await Item.sequelize.query(
      "SELECT I.id_item, I.id_type, I.name, I.image, FORMAT(I.price, 0) as price FROM items as I WHERE I.id_type = 4",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({ itemList });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const processingItem = async (req, res) => {
  const { id_item } = req.params;
  const { quantity } = req.body;
  try {
    const staff = await Item.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const ingredientList = await Item.sequelize.query(
      "SELECT R.id_item, R.id_ingredient, IG.unit, IG.name as name_ingredient, IG.image, (R.quantity*(:quantity)) as totalquantity, (SELECT quantity FROM ingredient_stores WHERE id_ingredient = R.id_ingredient AND id_store = :id_store) as quantity FROM recipes as R, ingredients as IG WHERE R.id_item = :id_item AND IG.id_ingredient = R.id_ingredient",
      {
        replacements: {
          id_item: id_item,
          quantity: quantity,
          id_store: staff[0].id_store,
        },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    let i = 0;
    let isEnough = 1;
    while (ingredientList[i]) {
      if (ingredientList[i].totalquantity >= ingredientList[i].quantity) {
        isEnough = 0;
        break;
      } else {
        i++;
      }
    }
    const item = await Item.sequelize.query(
      "SELECT I.*, T.name as name_type FROM items AS I, types as T WHERE T.id_type = I.id_type AND I.id_item = :id_item",
      {
        replacements: { id_item: id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if (isEnough == 1) {
      let j = 0;
      while (ingredientList[j]) {
        await Item.sequelize.query(
          "UPDATE ingredient_stores SET quantity = quantity - (:quantity) WHERE id_ingredient = :id_ingredient AND id_store = :id_store",
          {
            replacements: {
              id_ingredient: ingredientList[j].id_ingredient,
              quantity: ingredientList[j].totalquantity,
              id_store: staff[0].id_store,
            },
            type: QueryTypes.UPDATE,
            raw: true,
          }
        );
        j++;
      }
      await Item.sequelize.query(
        "UPDATE item_stores SET quantity = quantity + (:quantity) WHERE id_item = :id_item AND id_store = :id_store",
        {
          replacements: {
            quantity: quantity,
            id_item,
            id_store: staff[0].id_store,
          },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      res
        .status(201)
        .render("item/item-process", {
          message: "Chế biến thành công!",
          item: item[0],
        });
    } else {
      res.status(401).render("item/item-process", {
        message: "Số lượng nguyên liệu không đủ!",
        item: item[0],
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createForm = async (req, res) => {
  try {
    const typeList = await Type.findAll({ raw: true });
    res.status(200).render("item/item-create", { typeList, flag: 1 });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const processForm = async (req, res) => {
  const { id_item } = req.params;
  try {
    const item = await Item.sequelize.query(
      "SELECT I.*, T.name as name_type FROM items AS I, types as T WHERE T.id_type = I.id_type AND I.id_item = :id_item",
      {
        replacements: { id_item: id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("item/item-process", { item: item[0] });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

module.exports = {
  getAllItem,
  getDetailItem,
  get3ItemsEachType,
  createItem,
  updateItem,
  deleteItem,
  getItems,
  processingItem,
  getTopping,
  getAllItemInStore,
  createForm,
  processForm,
  getDetailItemUser,
};
