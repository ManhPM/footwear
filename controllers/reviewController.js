const { Review, Order_detail, Order, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const getAllReviewByItem = async (req, res) => {
  const { id_item } = req.params;
  try {
    const itemList = await Review.findOne({
      where: {
        id_item,
      },
    });
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json(error);
  }
};

const createReview = async (req, res) => {
  const { id_item } = req.params;
  const { id_order } = req.query;
  const { rating, comment } = req.body;
  try {
    const datetime = new Date();
    datetime.setHours(datetime.getHours() + 7);
    await Review.create({
      id_item,
      id_user: req.user.id,
      comment,
      createAt: datetime,
      rating,
    });
    await Order_detail.update(
      { reviewed: 1 },
      {
        where: {
          reviewed: 0,
          id_order,
          id_item,
        },
      }
    );
    res.status(200).json({ message: "Đánh giá thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllReviewByItem,
  createReview,
};
