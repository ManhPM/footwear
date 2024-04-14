const { Item, Export, Import, Item_detail, Type, Size } = require('../models');
const { QueryTypes } = require('sequelize');
const sequelize = require('sequelize');

const createItem = async (req, res) => {
  const { id_type, name, image, description, brand, origin, material } =
    req.body;
  try {
    await Item.create({
      id_type,
      name,
      image,
      description,
      brand,
      origin,
      material,
      status: 2,
    });
    res.status(201).json({ message: 'Tạo mới thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  const { id_item } = req.params;
  const { id_type, name, image, description, brand, origin, material } =
    req.body;
  try {
    const update = await Item.findOne({
      where: {
        id_item,
      },
      raw: false,
    });
    update.id_type = id_type;
    update.name = name;
    update.image = image;
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
  const id_type = req.query.id_type;
  const origin = req.query.origin;
  const material = req.query.material;
  const brand = req.query.brand;
  const size = req.query.size;
  const fromprice = req.query.fromprice;
  const toprice = req.query.toprice;
  const typesort = req.query.typesort || 0; // tăng dần, giảm dần theo giá
  const page = req.query.page || 1;
  let query =
    'SELECT I.* FROM items AS I, types as T WHERE I.id_type = T.id_type AND I.status != 0';
  if (brand) {
    query += ` AND I.brand ='${brand}'`;
  }
  if (origin) {
    query += ` AND I.origin ='${origin}'`;
  }
  if (material) {
    query += ` AND I.material ='${material}'`;
  }
  if (id_type) {
    query += ` AND I.id_type =${id_type}`;
    const selectString = query.slice(0, 7);
    query = 'SELECT T.name as name_type, ' + selectString;
  }
  let itemList = [];
  try {
    query += ` LIMIT ${(1 - page) * 8},8`;
    itemList = await Item.sequelize.query(query, {
      type: QueryTypes.SELECT,
      raw: true,
    });
    await Promise.all(
      itemList.map(async (item) => {
        const sizes = await Item_detail.findAll({
          where: {
            id_item: item.id_item,
          },
        });
        item.sizes = sizes;
      }),
    );
    if (typesort) {
      itemList.sort((a, b) => {
        const priceA = Math.min(...a.sizes.map((size) => size.price));
        const priceB = Math.min(...b.sizes.map((size) => size.price));
        return priceB - priceA;
      });
    }
    if (fromprice && toprice) {
      itemList = itemList.filter((item) =>
        item.sizes.some(
          (size) => size.price >= fromprice && size.price <= toprice,
        ),
      );
    }
    if (size) {
      itemList = itemList.filter((item) =>
        item.sizes.some((item) => item.id_size == size),
      );
    }
    res.status(200).json({ currentPage: page, data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchItem = async (req, res) => {
  const name = req.query.name;
  try {
    let itemList = await Item.sequelize.query(
      'SELECT I.* FROM items AS I WHERE I.status != 0 AND I.name COLLATE UTF8_GENERAL_CI LIKE :name',
      {
        replacements: {
          name: `%${name}%`,
        },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    await Promise.all(
      itemList.map(async (item) => {
        const sizes = await Item_detail.findAll({
          where: {
            id_item: item.id_item,
          },
        });
        item.sizes = sizes;
      }),
    );
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const item = await Item.findOne({
      where: {
        id_item,
      },
    });
    const sizes = await Item_detail.findAll({
      where: {
        id_item,
      },
    });
    item.sizes = sizes;
    res.status(200).json({ data: item });
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
    const itemList = await Type.findAll({});
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSize = async (req, res) => {
  try {
    const itemList = await Size.findAll({});
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
