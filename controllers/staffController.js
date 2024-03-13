const { Staff } = require('../models');
const { QueryTypes } = require('sequelize');

const getAllStaff = async (req, res) => {
  try {
    const itemList = await Staff.findAll({});
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStaff = async (req, res) => {
  const { id_staff } = req.params;
  const { name, phone, address } = req.body;
  try {
    const item = await Staff.findOne({
      where: {
        id_staff,
      },
      raw: false,
    });
    item.name = name;
    item.phone = phone;
    item.address = address;
    await item.save();
    res.status(201).json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStaff = async (req, res) => {
  const { id_staff } = req.params;
  try {
    const item = await Staff.findOne({
      where: {
        id_staff,
      },
      raw: false,
    });
    item.status = 0;
    await item.save();
    res.status(201).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStaff,
  updateStaff,
  deleteStaff,
};
