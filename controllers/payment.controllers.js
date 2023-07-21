const { Payment_method } = require("../models");

const getAllPaymentMethod = async (req, res) => {
  try {
    const paymentList = await Payment_method.findAll({});
    res.status(201).json({paymentList});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllPaymentMethodAdmin = async (req, res) => {
  try {
    const itemList = await Payment_method.findAll({raw: true});
    res.status(201).render("payment/payment-admin",{itemList, id_role: req.id_role});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createPaymentMethod = async (req, res) => {
  const {name} = req.body
  try {
    await Payment_method.create({name});
    res.status(201).render("payment/payment-create",{message: "Tạo mới thành công!", flag: 1})
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const updatePaymentMethod = async (req, res) => {
  const {id_payment} = req.params
  const {name} = req.body
  try {
    const update = await Payment_method.findOne({
      where: {
        id_payment
      }
    });
    update.name = name
    await update.save();
    const item = await Payment_method.findOne({
      raw: true,
      where: {
        id_payment
      }
    });
    res.status(201).render("payment/payment-create",{item,message: "Cập nhật thành công!",flag: 2})
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getDetailPaymentMethod = async (req, res) => {
  const {id_payment} = req.params
  try {
    const item = await Payment_method.findOne({
      raw: true,
      where: {
        id_payment
      }
    });
    res.status(200).render("payment/payment-create",{item, flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const createForm = async (req, res) => {
  try {
    res.status(200).render("payment/payment-create",{flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

module.exports = {
  getAllPaymentMethod,
  getDetailPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  getAllPaymentMethodAdmin,
  createForm
};
