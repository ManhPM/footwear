const { Export, Item } = require('../models');
const { QueryTypes } = require('sequelize');

const getAllExport = async (req, res) => {
  try {
    if (req.user.role == 'Admin') {
      const itemList = await Export.sequelize.query(
        'SELECT EP.*, S.name FROM staffs as S, exports as EP WHERE EP.id_staff = S.id_staff',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({
        data: itemList,
      });
    } else {
      const itemList = await Export.sequelize.query(
        'SELECT EP.*, S.name FROM staffs as S, exports as EP WHERE EP.id_staff = S.id_staff AND EP.id_staff = :id_staff',
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

const getAllItemInExport = async (req, res) => {
  const { id_export } = req.params;
  try {
    const itemList = await Export.sequelize.query(
      'SELECT I.name, ID.* FROM items AS I, export_details as ID WHERE ID.id_item = I.id_item AND ID.id_export = :id_export',
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

const deleteExport = async (req, res) => {
  const { id_export } = req.params;
  try {
    const item = await Export.findOne({
      where: {
        id_export,
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

const createExport = async (req, res) => {
  const { description } = req.body;
  try {
    const check = await Export.findOne({
      where: {
        id_staff: req.user.id_user,
        status: 0,
      },
    });
    if (!check) {
      const datetime = new Date();
      datetime.setHours(datetime.getHours() + 7);
      await Export.create({
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

const completeExport = async (req, res) => {
  const { id_export } = req.params;
  try {
    const itemInExportList = await Export.sequelize.query(
      'SELECT * FROM export_details WHERE id_export = :id_export',
      {
        replacements: { id_export },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    if (itemInExportList[0]) {
      let i = 0;
      let checkEnough = 1;
      while (itemInExportList[i]) {
        const item = await Item.findOne({
          where: {
            id_item: itemInExportList[i].id_item,
          },
        });
        if (itemInExportList[i].quantity > item.quantity) {
          checkEnough = 0;
        }
        i++;
      }
      if (checkEnough) {
        i = 0;
        while (itemInExportList[i]) {
          await Export.sequelize.query(
            'UPDATE items SET quantity = quantity - :quantity WHERE id_item = :id_item',
            {
              replacements: {
                quantity: itemInExportList[i].quantity,
                id_item: itemInExportList[i].id_item,
              },
              type: QueryTypes.UPDATE,
              raw: true,
            },
          );
          const item = await Item.findOne({
            where: {
              id_item: itemInExportList[i].id_item,
            },
          });
          if (item.quantity == 0) {
            await Import.sequelize.query(
              'UPDATE items SET status = 2 WHERE id_item = :id_item',
              {
                replacements: {
                  id_item: itemInExportList[i].id_item,
                },
                type: QueryTypes.UPDATE,
                raw: true,
              },
            );
          }
          i++;
        }
        await Export.sequelize.query(
          'UPDATE exports SET status = 1 WHERE id_export = :id_export',
          {
            replacements: { id_export },
            type: QueryTypes.UPDATE,
            raw: true,
          },
        );
        res.status(200).json({
          message: 'Đơn hàng hoàn thành!',
        });
      } else {
        res.status(200).json({
          message: 'Số lượng hàng không đủ không thể hoàn thành!',
        });
      }
    } else {
      await Export.sequelize.query(
        'UPDATE exports SET status = 1 WHERE id_export = :id_export',
        {
          replacements: { id_export },
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

const updateExport = async (req, res) => {
  const { id_export } = req.params;
  const { description } = req.body;
  try {
    const check = await Export.findOne({
      where: {
        id_export,
      },
      raw: false,
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

const getDetailExport = async (req, res) => {
  const { id_export } = req.params;
  try {
    const item = await Export.findOne({
      raw: true,
      where: {
        id_export,
      },
    });
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllExport,
  getDetailExport,
  getAllItemInExport,
  createExport,
  updateExport,
  deleteExport,
  completeExport,
};
