const { Material } = require('../models');

const getAllMaterial = async (req, res) => {
  try {
    const itemList = await Material.findAll({
      where: {
        status: 1,
      },
    });
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMaterial = async (req, res) => {
  const { name } = req.body;
  try {
    await Material.create({
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

const updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const item = await Material.findByPk(id);
    if (item.name == name) {
      res.status(201).json({ message: 'Cập nhật thành công' });
    } else {
      await Material.update({ name: name }, { where: { id_material: id } });
      res.status(201).json({ message: 'Cập nhật thành công' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    await Material.update({ status: 0 }, { where: { id_material: id } });
    res.status(201).json({ message: 'Xoá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMaterial,
  updateMaterial,
  deleteMaterial,
  createMaterial,
};
