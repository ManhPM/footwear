const { Origin } = require('../models');

const getAllOrigin = async (req, res) => {
  try {
    const itemList = await Origin.findAll({
      where: {
        status: 1,
      },
    });
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailOrigin = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Origin.findByPk(id);
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrigin = async (req, res) => {
  const { name } = req.body;
  try {
    await Origin.create({
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

const updateOrigin = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const item = await Origin.findByPk(id);
    if (item.name == name) {
      res.status(201).json({ message: 'Cập nhật thành công' });
    } else {
      await Origin.update({ name: name }, { where: { id_origin: id } });
      res.status(201).json({ message: 'Cập nhật thành công' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrigin = async (req, res) => {
  const { id } = req.params;
  try {
    await Origin.update({ status: 0 }, { where: { id_origin: id } });
    res.status(201).json({ message: 'Xoá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrigin,
  updateOrigin,
  deleteOrigin,
  createOrigin,
  getDetailOrigin,
};
