const { Item } = require("../models");
const { QueryTypes } = require("sequelize");

const createItem = async (req, res) => {
  const {
    id_type,
    name,
    price,
    authorName,
    language,
    image,
    numberOfVolumes,
    description,
    publicDate,
    publicComName,
  } = req.body;
  try {
    await Item.create({
      id_type,
      name,
      price,
      authorName,
      language,
      image,
      numberOfVolumes,
      description,
      publicDate,
      publicComName,
      status: 1,
    });
    res.status(201).json({ message: "Tạo mới thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  const { id_item } = req.params;
  const {
    name,
    price,
    authorName,
    language,
    image,
    numberOfVolumes,
    description,
    publicDate,
    publicComName,
  } = req.body;
  try {
    const update = await Item.findOne({
      where: {
        id_item,
      },
    });
    update.name = name;
    update.price = price;
    update.price = authorName;
    update.price = image;
    update.price = price;
    update.price = numberOfVolumes;
    update.price = description;
    update.price = publicDate;
    update.price = publicComName;
    update.price = language;
    await update.save();
    res.status(201).json({
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
        res.status(200).json({
          message: "Sản phẩm đã có thể kinh doanh!",
        });
      } else {
        itemUpdate.status = 0;
        await itemUpdate.save();
        res.status(200).json({
          message: "Xoá sản phẩm thành công!",
        });
      }
    } else {
      res.status(400).json({
        message: "Xoá sản phẩm thất bại. Còn hoá đơn đang hoạt động!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItem = async (req, res) => {
  const id_type = req.query.id_type;
  const typesort = req.query.typesort || 1; // tăng dần, giảm dần theo giá
  const keyword = req.query.keyword;
  try {
    if (id_type) {
      if (typesort == 1) {
        if (keyword) {
          const itemList = await Item.sequelize.query(
            "SELECT I.id_item, I.name, I.image, FORMAT(I.price, 0) as price, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND T.id_type = :id_type AND I.name COLLATE UTF8_GENERAL_CI LIKE :keyword AND I.authorName COLLATE UTF8_GENERAL_CI LIKE :keyword GROUP BY I.id_item ORDER BY I.price ASC",
            {
              replacements: {
                keyword: `%${keyword}%`,
                id_type: id_type,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ data: itemList });
        } else {
          const itemList = await Item.sequelize.query(
            "SELECT I.id_item, I.name, I.image, FORMAT(I.price, 0) as price, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND T.id_type = :id_type ORDER BY I.price ASC",
            {
              replacements: {
                id_type: id_type,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ data: itemList });
        }
      } else {
        if (keyword) {
          const itemList = await Item.sequelize.query(
            "SELECT I.id_item, I.name, I.image, FORMAT(I.price, 0) as price, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND T.id_type = :id_type AND I.name COLLATE UTF8_GENERAL_CI LIKE :keyword AND I.authorName COLLATE UTF8_GENERAL_CI LIKE :keyword GROUP BY I.id_item ORDER BY I.price DESC",
            {
              replacements: {
                keyword: `%${keyword}%`,
                id_type: id_type,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ data: itemList });
        } else {
          const itemList = await Item.sequelize.query(
            "SELECT I.id_item, I.name, I.image, FORMAT(I.price, 0) as price, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND T.id_type = :id_type ORDER BY I.price DESC",
            {
              replacements: {
                id_type: id_type,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ data: itemList });
        }
      }
    } else {
      if (typesort == 1) {
        if (keyword) {
          const itemList = await Item.sequelize.query(
            "SELECT I.id_item, I.name, I.image, FORMAT(I.price, 0) as price, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.name COLLATE UTF8_GENERAL_CI LIKE :keyword AND I.authorName COLLATE UTF8_GENERAL_CI LIKE :keyword GROUP BY I.id_item ORDER BY I.price ASC",
            {
              replacements: {
                keyword: `%${keyword}%`,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ data: itemList });
        } else {
          const itemList = await Item.sequelize.query(
            "SELECT I.id_item, I.name, I.image, FORMAT(I.price, 0) as price, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type ORDER BY I.price DESC",
            {
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ data: itemList });
        }
      } else {
        if (keyword) {
          const itemList = await Item.sequelize.query(
            "SELECT I.id_item, I.name, I.image, FORMAT(I.price, 0) as price, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.name COLLATE UTF8_GENERAL_CI LIKE :keyword AND I.authorName COLLATE UTF8_GENERAL_CI LIKE :keyword GROUP BY I.id_item ORDER BY I.price DESC",
            {
              replacements: {
                keyword: `%${keyword}%`,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ data: itemList });
        } else {
          const itemList = await Item.sequelize.query(
            "SELECT I.id_item, I.name, I.image, FORMAT(I.price, 0) as price, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type ORDER BY I.price DESC",
            {
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ data: itemList });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const item = await Item.sequelize.query(
      "SELECT I.id_item, I.authorName, I.language, I.description, I.numberOfVolumes, I.publicComName, I.publicDate, I.quantity, I.status, I.id_type, I.name, I.image, FORMAT(I.price, 0) as price, T.name as name_type, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items AS I, types as T WHERE T.id_type = I.id_type AND I.id_item = :id_item",
      {
        replacements: { id_item: id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({ data: item[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllItem,
  getDetailItem,
  createItem,
  updateItem,
  deleteItem,
};
