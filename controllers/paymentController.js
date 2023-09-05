const { Payment_method } = require("../models");

const getAllPaymentMethod = async (req, res) => {
  try {
    const paymentList = await Payment_method.findAll({});
    res.status(201).json({ data: paymentList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPaymentMethod,
};
