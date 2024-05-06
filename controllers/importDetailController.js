const { Import_detail, Import } = require('../models');
const { QueryTypes } = require('sequelize');

const createImportDetail = async (req, res) => {
  const { quantity, id_item_detail, unit_price, id_import } = req.body;
  try {
    await Import_detail.create({
      id_import,
      id_item_detail,
      quantity,
      unit_price,
    });
    res.status(200).json({
      message: 'Tạo mới thành công!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateImportDetail = async (req, res) => {
  const { quantity, unit_price, id_import, id_item_detail } = req.body;
  try {
    const check = await Import.findOne({
      where: {
        id_import,
      },
    });
    if (check.status != 1) {
      await Import_detail.sequelize.query(
        'UPDATE import_details SET quantity = :quantity, unit_price = :unit_price WHERE id_import = :id_import AND id_item_detail = :id_item_detail',
        {
          replacements: { id_import, id_item_detail, quantity, unit_price },
          type: QueryTypes.UPDATE,
          raw: true,
        },
      );
      res.status(200).json({
        message: 'Cập nhật thành công!',
      });
    } else {
      res
        .status(400)
        .json({ message: 'Không thể cập nhật hoá đơn đã hoàn thành!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteImportDetail = async (req, res) => {
  const { id_import, id_item_detail } = req.body;
  try {
    const check = await Import.findOne({
      where: {
        id_import,
      },
    });
    if (check.status != 1) {
      await Import_detail.destroy({
        where: {
          id_import,
          id_item_detail,
        },
      });
      res.status(200).json({
        message: 'Xoá thành công!',
      });
    } else {
      res.status(400).json({ message: 'Không thể xoá hoá đơn đã hoàn thành!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailImportDetail = async (req, res) => {
  const { id_import, id_item_detail } = req.params;
  try {
    const item = await Import_detail.findOne({
      where: {
        id_import,
        id_item_detail,
      },
    });
    res.status(200).json({
      data: item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createImportDetail,
  updateImportDetail,
  deleteImportDetail,
  getDetailImportDetail,
};
