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
  const { id } = req.params;
  const { name } = req.body;
  try {
    const item = await Provider.findByPk(id);
    if (item.name == name) {
      res.status(201).json({ message: 'Cập nhật thành công' });
    } else {
      await Provider.update({ name: name }, { where: { id_provider: id } });
      res.status(201).json({ message: 'Cập nhật thành công' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProvider = async (req, res) => {
  const { id } = req.params;
  try {
    await Provider.update({ status: 0 }, { where: { id_provider: id } });
    res.status(201).json({ message: 'Xoá thành công' });
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
