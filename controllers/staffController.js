const { Staff, Account } = require('../models');
const { QueryTypes } = require('sequelize');

const getAllStaff = async (req, res) => {
  try {
    const itemList = await Staff.findAll({});
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Staff.findByPk(id);
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, phone, address } = req.body;
  try {
    const item = await Staff.findOne({
      where: {
        id_staff: id,
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
  const { id } = req.params;
  try {
    const staff = await Staff.findOne({ id: id });
    await Staff.update({ status: 0 }, { where: { id_staff: id } });
    await Account.update(
      { status: 0 },
      { where: { id_account: staff.id_account } },
    );
    res.status(201).json({ message: 'Xoá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllStaff,
  updateStaff,
  deleteStaff,
  getDetailStaff,
};
