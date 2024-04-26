const { Payment_method } = require('../models');

const getAllPaymentMethod = async (req, res) => {
  try {
    const itemList = await Payment_method.findAll({
      where: {
        status: 1,
      },
    });
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailPaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Payment_method.findByPk(id);
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPaymentMethod = async (req, res) => {
  const { name } = req.body;
  try {
    await Payment_method.create({
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

const updatePaymentMethod = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const item = await Payment_method.findByPk(id);
    if (item.name == name) {
      res.status(201).json({ message: 'Cập nhật thành công' });
    } else {
      await Payment_method.update(
        { name: name },
        { where: { id_payment_method: id } },
      );
      res.status(201).json({ message: 'Cập nhật thành công' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePaymentMethod = async (req, res) => {
  const { id } = req.params;
  try {
    await Payment_method.update(
      { status: 0 },
      { where: { id_payment_method: id } },
    );
    res.status(201).json({ message: 'Xoá thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  createPaymentMethod,
  getDetailPaymentMethod,
};
