const { Export_detail, Export } = require('../models');
const { QueryTypes } = require('sequelize');

const createExportDetail = async (req, res) => {
  const { quantity, id_item, unit_price, id_export } = req.body;
  try {
    await Export_detail.create({
      id_export,
      id_item,
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

const updateExportDetail = async (req, res) => {
  const { quantity, unit_price, id_export, id_item } = req.body;
  try {
    const check = await Export.findOne({
      where: {
        id_export,
      },
    });
    if (check.status != 1) {
      await Export_detail.sequelize.query(
        'UPDATE export_details SET quantity = :quantity, unit_price = :unit_price WHERE id_export = :id_export AND id_item = :id_item',
        {
          replacements: { id_export, id_item, quantity, unit_price },
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

const deleteExportDetail = async (req, res) => {
  const { id_export, id_item } = req.body;
  try {
    const check = await Export.findOne({
      where: {
        id_export,
      },
    });
    if (check.status != 1) {
      await Export_detail.destroy({
        where: {
          id_export,
          id_item,
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

const getDetailExportDetail = async (req, res) => {
  const { id_export, id_item } = req.body;
  try {
    const item = await Export_detail.findOne({
      where: {
        id_export,
        id_item,
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
  createExportDetail,
  updateExportDetail,
  deleteExportDetail,
  getDetailExportDetail,
};
