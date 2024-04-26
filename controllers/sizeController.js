const { Size } = require('../models');

const getAllSize = async (req, res) => {
  try {
    const itemList = await Size.findAll({
      where: {
        status: 1,
      },
    });
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailSize = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Size.findByPk(id);
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSize = async (req, res) => {
  const { name } = req.body;
  try {
    await Size.create({
      name,
      status: 1,
    });
    res.status(201).json({
      message: 'Tạo mới thành công!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSize = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const item = await Size.findByPk(id);
    if (item.name == name) {
      res.status(201).json({ message: 'Cập nhật thành công' });
    } else {
      await Size.update({ name: name }, { where: { id_size: id } });
      res.status(201).json({ message: 'Cập nhật thành công' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSize = async (req, res) => {
  const { id } = req.params;
  try {
    await Size.update({ status: 0 }, { where: { id_size: id } });
    res.status(201).json({ message: 'Xoá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSize,
  updateSize,
  deleteSize,
  createSize,
  getDetailSize,
};
