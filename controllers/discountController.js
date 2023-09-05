const { Discount } = require("../models");
const { QueryTypes } = require("sequelize");

const getAllDiscount = async (req, res) => {
  try {
    const discountList = await Discount.sequelize.query(
      "SELECT D.id_discount, D.code, D.discount_percent, D.min_quantity, D.quantity, D.description, DATE_FORMAT(D.start_date, '%d/%m/%Y') as start_date, DATE_FORMAT(D.end_date, '%d/%m/%Y') as end_date FROM discounts as D",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(201).json({ data: discountList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDiscount,
};
