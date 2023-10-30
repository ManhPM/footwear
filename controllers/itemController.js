const { Item } = require("../models");
const { exec } = require("child_process");
const path = require("path");
const { QueryTypes } = require("sequelize");
const sequelize = require("sequelize");
const Sequelize = require("sequelize");
const { Op } = sequelize;

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
    style,
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
      style,
      quantity: 0,
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
    style,
  } = req.body;
  try {
    const update = await Item.findOne({
      where: {
        id_item,
      },
    });
    update.name = name;
    update.authorName = authorName;
    update.image = image;
    update.price = price;
    update.numberOfVolumes = numberOfVolumes;
    update.description = description;
    update.publicDate = publicDate;
    update.publicComName = publicComName;
    update.language = language;
    update.style = style;
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
  const page = req.query.page || 1;
  let itemList = [];
  try {
    if (id_type) {
      if (typesort == 1) {
        if (keyword) {
          itemList = await Item.sequelize.query(
            "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 AND T.id_type = :id_type AND (I.name COLLATE UTF8_GENERAL_CI LIKE :keyword OR I.authorName COLLATE UTF8_GENERAL_CI LIKE :keyword) GROUP BY I.id_item ORDER BY I.price ASC LIMIT :from,:get",
            {
              replacements: {
                keyword: `%${keyword}%`,
                id_type,
                from: (page - 1) * 12,
                get: 12,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        } else {
          itemList = await Item.sequelize.query(
            "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 AND T.id_type = :id_type ORDER BY I.price ASC LIMIT :from,:get",
            {
              replacements: {
                id_type: id_type,
                from: (page - 1) * 12,
                get: 12,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        }
      } else {
        if (keyword) {
          itemList = await Item.sequelize.query(
            "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 AND T.id_type = :id_type AND (I.name COLLATE UTF8_GENERAL_CI LIKE :keyword OR I.authorName COLLATE UTF8_GENERAL_CI LIKE :keyword) GROUP BY I.id_item ORDER BY I.price DESC LIMIT :from,:get",
            {
              replacements: {
                keyword: `%${keyword}%`,
                id_type: id_type,
                from: (page - 1) * 12,
                get: 12,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        } else {
          itemList = await Item.sequelize.query(
            "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 AND T.id_type = :id_type ORDER BY I.price DESC LIMIT :from,:get",
            {
              replacements: {
                id_type: id_type,
                from: (page - 1) * 12,
                get: 12,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        }
      }
    } else {
      if (typesort == 1) {
        if (keyword) {
          itemList = await Item.sequelize.query(
            "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 AND (I.name COLLATE UTF8_GENERAL_CI LIKE :keyword OR I.authorName COLLATE UTF8_GENERAL_CI LIKE :keyword) GROUP BY I.id_item ORDER BY I.price ASC LIMIT :from,:get",
            {
              replacements: {
                keyword: `%${keyword}%`,
                from: (page - 1) * 12,
                get: 12,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        } else {
          itemList = await Item.sequelize.query(
            "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 ORDER BY I.price DESC LIMIT :from,:get",
            {
              replacements: { from: (page - 1) * 12, get: 12 },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        }
      } else {
        if (keyword) {
          itemList = await Item.sequelize.query(
            "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 AND (I.name COLLATE UTF8_GENERAL_CI LIKE :keyword OR I.authorName COLLATE UTF8_GENERAL_CI LIKE :keyword) GROUP BY I.id_item ORDER BY I.price DESC LIMIT :from,:get",
            {
              replacements: {
                keyword: `%${keyword}%`,
                from: (page - 1) * 12,
                get: 12,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        } else {
          itemList = await Item.sequelize.query(
            "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 ORDER BY I.price DESC LIMIT :from,:get",
            {
              replacements: {
                from: (page - 1) * 12,
                get: 12,
              },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
        }
      }
    }
    const count = await Item.sequelize.query(
      "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE T.id_type = I.id_type AND I.status != 0 ORDER BY I.price DESC",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({ data: itemList, total: count.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sanPhamLienQuan = async (req, res) => {
  const { id_item } = req.params;
  try {
    const item = await Item.findOne({
      where: {
        id_item,
      },
    });
    const itemList = await Item.sequelize.query(
      "SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items as I, types as T WHERE I.id_item != :id_item AND T.id_type = I.id_type AND I.status != 0 AND (I.name COLLATE UTF8_GENERAL_CI LIKE :keyword OR I.authorName COLLATE UTF8_GENERAL_CI LIKE :authorName) GROUP BY I.id_item ORDER BY I.price ASC",
      {
        replacements: {
          keyword: `%${item.name}%`,
          authorName: item.authorName,
          id_item,
        },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({ data: itemList, total: itemList.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookRecommendationCF = async (req, res) => {
  const id_user = req.user.id;
  try {
    var modifiedString;
    var arrayFromString = [];
    const getData = path.join(__dirname, "..") + "\\python\\getData.py";
    const getRecommendation =
      path.join(__dirname, "..") + `\\python\\CF.py ${id_user}`;
    const runGetData = new Promise((resolve, reject) => {
      exec(`python ${getData}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Lỗi khi chạy câu lệnh 1: ${error.message}`);
          reject(error);
        }
        resolve();
      });
    });

    const runGetRecommendation = new Promise((resolve, reject) => {
      exec(`python ${getRecommendation}`, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Lỗi khi chạy câu lệnh 2: ${error.message}`);
          reject(error);
        }
        modifiedString = stdout.replace(/\./g, ",");
        arrayFromString = JSON.parse(modifiedString);
        resolve();
      });
    });
    // Chạy hai câu lệnh python đồng bộ
    await Promise.all([runGetData, runGetRecommendation]);
    const books = await Item.findAll({
      where: {
        id_item: {
          [Op.in]: arrayFromString,
        },
      },
    });
    res.status(200).json({ data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookRecommendationSVM = async (req, res) => {
  const ans = req.body.ans;
  try {
    var style = "";
    const getData =
      path.join(__dirname, "..") +
      "\\python\\testModel.py" +
      ` ${ans[0]} ${ans[1]} ${ans[2]} ${ans[3]} ${ans[4]} ${ans[5]} ${ans[6]} ${ans[7]}`;
    const runGetRecommendation = new Promise((resolve, reject) => {
      exec(`python ${getData}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Lỗi khi chạy câu lệnh 1: ${error.message}`);
          reject(error);
        }
        style = stdout.substring(0, stdout.length - 2);
        resolve();
      });
    });
    // Chạy hai câu lệnh python đồng bộ
    await Promise.all([runGetRecommendation]);
    console.log(style);
    const books = await Item.findAll({
      where: {
        style: style,
      },  
      order: Sequelize.literal("rand()"),
    });
    res.status(200).json({ data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const item = await Item.sequelize.query(
      "SELECT I.*, T.name as name_type, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items AS I, types as T WHERE T.id_type = I.id_type AND I.id_item = :id_item",
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

const getAllItemToImport = async (req, res) => {
  const { id_i_invoice } = req.params;
  try {
    const itemList = await Import_invoice.sequelize.query(
      "SELECT * FROM items WHERE id_item NOT IN(SELECT id_item FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice)",
      {
        replacements: { id_i_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllItem,
  getAllItemToImport,
  getDetailItem,
  createItem,
  updateItem,
  deleteItem,
  sanPhamLienQuan,
  bookRecommendationCF,
  bookRecommendationSVM,
};
