const { Import, Item, Import_detail, Item_detail } = require('../models');
const { QueryTypes, where } = require('sequelize');

const getAllImport = async (req, res) => {
  try {
    if (req.user.role == 'Admin') {
      const itemList = await Import.sequelize.query(
        'SELECT IP.*, S.name as name_staff, P.name as name_provider FROM staffs as S, imports as IP, providers as P WHERE IP.id_staff = S.id_staff AND IP.id_provider = P.id_provider',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({
        data: itemList,
      });
    } else {
      const itemList = await Import.sequelize.query(
        'SELECT IP.*, S.name as name_staff, P.name as name_provider FROM staffs as S, imports as IP, providers as P WHERE IP.id_staff = S.id_staff AND IP.id_provider = P.id_provider AND IP.id_staff = :id_staff',
        {
          replacements: { id_staff: req.user.id_user },
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({
        data: itemList,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItemInImport = async (req, res) => {
  const { id_import } = req.params;
  try {
    let itemList = await Import_detail.findAll({
      where: {
        id_import,
      },
    });
    await Promise.all(
      itemList.map(async (item) => {
        const data = await Item_detail.findOne({
          where: {
            id_item_detail: item.id_item_detail,
          },
        });
        const itemName = await Item.findOne({
          where: {
            id_item: data.id_item,
          },
        });
        item.price = data.price;
        item.size = data.id_size;
        item.name = itemName.name;
        item.id_item = itemName.id_item;
      }),
    );
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteImport = async (req, res) => {
  const { id_import } = req.params;
  try {
    const item = await Import.findOne({
      where: {
        id_import,
      },
      raw: false,
    });
    if (item.status != 0) {
      res.status(400).json({
        message: 'Không thể xóa hóa đơn đã hoàn thành hoặc đã hủy',
      });
    } else {
      item.status = 2;
      await item.save();
      res.status(200).json({
        message: 'Xóa thành công',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createImport = async (req, res) => {
  const { description, id_provider } = req.body;
  try {
    const check = await Import.findOne({
      where: {
        id_staff: req.user.id_user,
        status: 0,
      },
    });
    if (!check) {
      const datetime = new Date();
      datetime.setHours(datetime.getHours() + 7);
      await Import.create({
        description,
        id_provider,
        id_staff: req.user.id_user,
        datetime: datetime,
        status: 0,
      });
      res.status(201).json({
        message: 'Tạo mới thành công!',
      });
    } else {
      res.status(400).json({
        message: 'Đang có đơn chưa hoàn thành không thể tạo thêm!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeImport = async (req, res) => {
  const { id_import } = req.params;
  try {
    const itemInImportList = await Import.sequelize.query(
      'SELECT * FROM import_details WHERE id_import = :id_import',
      {
        replacements: { id_import },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    if (itemInImportList[0]) {
      let i = 0;
      while (itemInImportList[i]) {
        await Import.sequelize.query(
          'UPDATE item_details SET quantity = quantity + :quantity WHERE id_item_detail = :id_item_detail',
          {
            replacements: {
              quantity: itemInImportList[i].quantity,
              id_item_detail: itemInImportList[i].id_item_detail,
            },
            type: QueryTypes.UPDATE,
            raw: true,
          },
        );
        const updateStatus = await Item_detail.findOne({
          where: {
            id_item_detail: itemInImportList[i].id_item_detail,
          },
        });
        await Import.sequelize.query(
          'UPDATE items SET status = 1 WHERE id_item = :id_item',
          {
            replacements: {
              id_item: updateStatus.id_item,
            },
            type: QueryTypes.UPDATE,
            raw: true,
          },
        );
        i++;
      }
      await Import.sequelize.query(
        'UPDATE imports SET status = 1 WHERE id_import = :id_import',
        {
          replacements: { id_import },
          type: QueryTypes.UPDATE,
          raw: true,
        },
      );
      res.status(200).json({
        message: 'Đơn hàng hoàn thành!',
      });
    } else {
      await Import.sequelize.query(
        'UPDATE imports SET status = 1 WHERE id_import = :id_import',
        {
          replacements: { id_import },
          type: QueryTypes.UPDATE,
          raw: true,
        },
      );
      res.status(200).json({
        message: 'Đơn hàng hoàn thành!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateImport = async (req, res) => {
  const { id_import } = req.params;
  const { description, id_provider } = req.body;
  try {
    const check = await Import.findOne({
      where: {
        id_import,
      },
      raw: false,
    });
    check.description = description;
    check.id_provider = id_provider;
    await check.save();
    res.status(200).json({
      message: 'Cập nhật thành công!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailImport = async (req, res) => {
  const { id_import } = req.params;
  try {
    const item = await Import.findOne({
      raw: true,
      where: {
        id_import,
      },
    });
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllImport,
  getDetailImport,
  getAllItemInImport,
  createImport,
  updateImport,
  deleteImport,
  completeImport,
};
