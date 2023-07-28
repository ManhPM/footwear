const { Discount } = require("../models");
const { QueryTypes } = require("sequelize");

const getAllDiscount = async (req, res) => {
  try {
    const discountList = await Discount.sequelize.query(
      "SELECT D.code, D.discount_percent, D.min_quantity, D.quantity, D.description, DATE_FORMAT(D.start_date, '%d/%m/%Y') as start_date, DATE_FORMAT(D.end_date, '%d/%m/%Y') as end_date FROM discounts as D",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(201).json({discountList});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllDiscountAdmin = async (req, res) => {
  try {
    const discountList = await Discount.sequelize.query(
      "SELECT D.code, D.discount_percent, D.min_quantity, D.quantity, D.description, DATE_FORMAT(D.start_date, '%d/%m/%Y') as start_date, DATE_FORMAT(D.end_date, '%d/%m/%Y') as end_date FROM discounts as D",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(201).render("discount/discount",{discountList, id_role: req.id_role});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createDiscount = async (req, res) => {
  const {code, discount_percent, end_date, min_quantity, quantity, description} = req.body
  try {
    const start_date = new Date();
    start_date.setHours(start_date.getHours() + 7);
    await Discount.create({code, discount_percent, start_date, end_date, min_quantity, quantity, description});
    res.status(201).render("discount/discount-create",{message: "Tạo mới thành công!", flag: 1})
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const updateDiscount = async (req, res) => {
  const {code} = req.params
  const { discount_percent, end_date, min_quantity, quantity, description} = req.body
  try {
    const update = await Discount.findOne({
      where: {
        code
      }
    });
    update.discount_percent = discount_percent
    update.end_date = end_date
    update.min_quantity = min_quantity
    update.quantity = quantity
    update.description = description
    await update.save();
    const item = await Discount.findOne({
      raw: true,
      where: {
        code
      }
    });
    res.status(201).render("discount/discount-create",{item,message: "Cập nhật thành công!",flag: 2})
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getDetailDiscount = async (req, res) => {
  const {code} = req.params
  try {
    const item = await Discount.findOne({
      raw: true,
      where: {
        code,
      },
    });
    res.status(200).render("discount/discount-create",{item, flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const createForm = async (req, res) => {
  try {
    res.status(200).render("discount/discount-create",{flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

module.exports = {
  getAllDiscount,
  createDiscount,
  updateDiscount,
  getDetailDiscount,
  getAllDiscountAdmin,
  createForm
};
