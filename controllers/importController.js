const { Import, Item } = require('../models');
const { QueryTypes } = require('sequelize');

const getAllImport = async (req, res) => {
  try {
    if (req.user.role == 'Admin') {
      const itemList = await Import.sequelize.query(
        'SELECT IP.*, S.name FROM staffs as S, imports as IP WHERE IP.id_staff = S.id_staff',
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
        'SELECT IP.*, S.name FROM staffs as S, imports as IP WHERE IP.id_staff = S.id_staff AND IP.id_staff = :id_staff',
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
    const itemList = await Import.sequelize.query(
      'SELECT I.name, ID.* FROM items AS I, import_details as ID WHERE ID.id_item = I.id_item AND ID.id_import = :id_import',
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

const deleteImport = async (req, res) => {
  const { id_import } = req.params;
  try {
    const item = await Import.findOne({
      where: {
        id_import,
      },
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
  const { description } = req.body;
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
      let checkEnough = 1;
      while (itemInImportList[i]) {
        await Import.sequelize.query(
          'UPDATE items SET quantity = quantity + :quantity WHERE id_item = :id_item',
          {
            replacements: {
              quantity: itemInImportList[i].quantity,
              id_item: itemInImportList[i].id_item,
            },
            type: QueryTypes.UPDATE,
            raw: true,
          },
        );
        await Import.sequelize.query(
          'UPDATE items SET status = 1 WHERE id_item = :id_item',
          {
            replacements: {
              id_item: itemInImportList[i].id_item,
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
  const { description } = req.body;
  try {
    const check = await Import.findOne({
      where: {
        id_import,
      },
    });
    check.description = description;
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
