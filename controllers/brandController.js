const { Brand } = require('../models');

const getAllBrand = async (req, res) => {
  try {
    const itemList = await Brand.findAll({
      where: {
        status: 1,
      },
    });
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Brand.findByPk(id);
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBrand = async (req, res) => {
  const { name } = req.body;
  try {
    await Brand.create({
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

const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const item = await Brand.findByPk(id);
    if (item.name == name) {
      res.status(201).json({ message: 'Cập nhật thành công' });
    } else {
      await Brand.update({ name: name }, { where: { id_brand: id } });
      res.status(201).json({ message: 'Cập nhật thành công' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    await Brand.update({ status: 0 }, { where: { id_brand: id } });
    res.status(201).json({ message: 'Xoá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBrand,
  getDetailBrand,
  updateBrand,
  deleteBrand,
  createBrand,
};
