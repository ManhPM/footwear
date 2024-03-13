const { Item, Export, Import } = require('../models');
const { QueryTypes } = require('sequelize');
const sequelize = require('sequelize');

const createItem = async (req, res) => {
  const {
    type,
    name,
    price,
    size,
    image,
    description,
    brand,
    origin,
    material,
  } = req.body;
  try {
    await Item.create({
      type,
      name,
      price,
      size,
      image,
      description,
      brand,
      origin,
      material,
      quantity: 0,
      status: 2,
    });
    res.status(201).json({ message: 'Tạo mới thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  const { id_item } = req.params;
  const {
    type,
    name,
    price,
    size,
    image,
    description,
    brand,
    origin,
    material,
  } = req.body;
  try {
    const update = await Item.findOne({
      where: {
        id_item,
      },
      raw: false,
    });
    update.type = type;
    update.name = name;
    update.size = size;
    update.image = image;
    update.price = price;
    update.brand = brand;
    update.description = description;
    update.origin = origin;
    update.material = material;
    await update.save();
    res.status(201).json({
      message: 'Cập nhật thành công!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const itemUpdate = await Item.findOne({
      where: {
        id_item,
      },
      raw: false,
    });
    if (itemUpdate.status == 0) {
      itemUpdate.status = 1;
      await itemUpdate.save();
      res.status(200).json({
        message: 'Sản phẩm đã có thể kinh doanh trở lại!',
      });
    } else {
      itemUpdate.status = 0;
      await itemUpdate.save();
      res.status(200).json({
        message: 'Xoá sản phẩm thành công!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItem = async (req, res) => {
  const type = req.query.type;
  const origin = req.query.origin;
  const material = req.query.material;
  const brand = req.query.brand;
  const size = req.query.size;
  const fromprice = req.query.fromprice;
  const toprice = req.query.toprice;
  const typesort = req.query.typesort || 1; // tăng dần, giảm dần theo giá
  const page = req.query.page || 1;
  let query =
    'SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items AS I WHERE I.status != 0';
  if (brand) {
    query += ` AND I.brand =${brand}`;
  }
  if (type) {
    query += ` AND I.type =${type}`;
  }
  if (origin) {
    query += ` AND I.origin =${origin}`;
  }
  if (material) {
    query += ` AND I.material =${material}`;
  }
  if (size) {
    query += ` AND I.size =${size}`;
  }
  let itemList = [];
  try {
    if (fromprice && toprice) {
      if (typesort) {
        query += ` AND (I.price BETWEEN ${fromprice - 1} AND ${toprice + 1}) ORDER BY I.price ASC LIMIT ${(1 - page) * 12},12`;
      } else {
        query += ` AND (I.price BETWEEN ${fromprice - 1} AND ${toprice + 1}) ORDER BY I.price DESC LIMIT ${(1 - page) * 12},12`;
      }
    } else {
      if (typesort) {
        query += ` ORDER BY I.price ASC LIMIT ${(1 - page) * 12},12`;
      } else {
        query += ` ORDER BY I.price DESC LIMIT ${(1 - page) * 12},12`;
      }
    }
    itemList = await Item.sequelize.query(query, {
      type: QueryTypes.SELECT,
      raw: true,
    });
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchItem = async (req, res) => {
  const name = req.query.name;
  try {
    const itemList = await Item.sequelize.query(
      'SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items AS I WHERE I.status != 0 AND I.name COLLATE UTF8_GENERAL_CI LIKE :name',
      {
        replacements: {
          name: `%${name}%`,
        },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const item = await Item.sequelize.query(
      'SELECT I.*, IFNULL((SELECT ROUND(AVG(R.rating) * 2, 0) / 2 FROM reviews AS R WHERE R.id_item = I.id_item), 0) as rating FROM items AS I WHERE I.id_item = :id_item',
      {
        replacements: { id_item: id_item },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    res.status(200).json({ data: item[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItemToImport = async (req, res) => {
  const { id_import } = req.params;
  try {
    const itemList = await Import.sequelize.query(
      'SELECT * FROM items WHERE id_item NOT IN(SELECT id_item FROM import_details WHERE id_import = :id_import)',
      {
        replacements: { id_import },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItemToExport = async (req, res) => {
  const { id_export } = req.params;
  try {
    const itemList = await Export.sequelize.query(
      'SELECT * FROM items WHERE id_item NOT IN(SELECT id_item FROM export_details WHERE id_export = :id_export)',
      {
        replacements: { id_export },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllType = async (req, res) => {
  try {
    const itemList = await Item.findAll({
      attributes: ['type'],
      group: ['type'],
    });
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSize = async (req, res) => {
  try {
    const itemList = await Item.findAll({
      attributes: ['size'],
      group: ['size'],
    });
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBrand = async (req, res) => {
  try {
    const itemList = await Item.findAll({
      attributes: ['brand'],
      group: ['brand'],
    });
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrigin = async (req, res) => {
  try {
    const itemList = await Item.findAll({
      attributes: ['origin'],
      group: ['origin'],
    });
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMaterial = async (req, res) => {
  try {
    const itemList = await Item.findAll({
      attributes: ['material'],
      group: ['material'],
    });
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchItem,
  getAllItem,
  getAllItemToImport,
  getAllItemToExport,
  getDetailItem,
  createItem,
  updateItem,
  deleteItem,
  getAllType,
  getAllBrand,
  getAllMaterial,
  getAllOrigin,
  getAllSize,
};
