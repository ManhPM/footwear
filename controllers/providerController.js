const { Provider } = require('../models');
const { Op } = require('sequelize');

const getAllProvider = async (req, res) => {
  try {
    const itemList = await Provider.findAll({
      where: {
        status: {
          [Op.not]: 0,
        },
      },
    });
    res.status(201).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Provider.findByPk(id);
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProvider = async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    await Provider.create({
      name,
      phone,
      address,
      status: 1,
    });
    res.status(201).json({
      message: 'Tạo mới thành công!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProvider = async (req, res) => {
  const { id_provider } = req.params;
  const { name, phone, address } = req.body;
  try {
    const item = await Provider.findOne({
      where: {
        id_provider,
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

const deleteProvider = async (req, res) => {
  const { id_provider } = req.params;
  try {
    const item = await Provider.findOne({
      where: {
        id_provider,
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
  getAllProvider,
  createProvider,
  updateProvider,
  deleteProvider,
  getDetailProvider,
};
