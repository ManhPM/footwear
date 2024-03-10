const { Wishlist, Item } = require('../models');
const { QueryTypes } = require('sequelize');

const getAllItemInWishList = async (req, res) => {
  try {
    const itemList = await Item.sequelize.query(
      'SELECT I.* FROM wishlists as W, items as I WHERE I.id_item = W.id_item AND W.id_customer = :id_customer',
      {
        replacements: { id_customer: req.user.id_user },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItemInWishList = async (req, res) => {
  const { id_item } = req.params;
  try {
    const isExist = await Wishlist.findOne({
      where: {
        id_item,
        id_customer: req.user.id_user,
      },
    });
    if (isExist) {
      await Wishlist.destroy({
        where: {
          id_item,
          id_customer: req.user.id_user,
        },
      });
      res.status(201).json({ message: 'Đã xoá khỏi danh sách yêu thích!' });
    } else {
      await Wishlist.create({
        id_item,
        id_customer: req.user.id_user,
      });
      res.status(201).json({ message: 'Đã thêm vào danh sách yêu thích!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Thao tác thất bại!' });
  }
};

module.exports = {
  getAllItemInWishList,
  updateItemInWishList,
};
