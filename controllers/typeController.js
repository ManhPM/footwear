const { Type } = require('../models');

const getAllType = async (req, res) => {
  try {
    const itemList = await Type.findAll({
      where: {
        status: 1,
      },
    });
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailType = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Type.findByPk(id);
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createType = async (req, res) => {
  const { name } = req.body;
  try {
    await Type.create({
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

const updateType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const item = await Type.findByPk(id);
    if (item.name == name) {
      res.status(201).json({ message: 'Cập nhật thành công' });
    } else {
      await Type.update({ name: name }, { where: { id_type: id } });
      res.status(201).json({ message: 'Cập nhật thành công' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteType = async (req, res) => {
  const { id } = req.params;
  try {
    await Type.update({ status: 0 }, { where: { id_type: id } });
    res.status(201).json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllType,
  updateType,
  deleteType,
  createType,
  getDetailType,
};
