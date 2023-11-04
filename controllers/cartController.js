const { Cart, Item, Order, Order_detail, Discount } = require("../models");
const { QueryTypes } = require("sequelize");
const storeLat = 10.848881;
const storeLng = 106.787017;
const deli_unit_price = 3000;

const getAllItemInCart = async (req, res) => {
  try {
    const itemList = await Item.sequelize.query(
      "SELECT I.image, I.id_item, I.name, I.price, C.quantity, (C.quantity*I.price) as amount FROM carts as C, items as I where C.id_item = I.id_item AND C.id_user = :id_user",
      {
        replacements: { id_user: req.user.id },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createItemInCart = async (req, res) => {
  const { id_item } = req.params;
  const { quantity } = req.body;
  try {
    const isExist = await Cart.findOne({
      where: {
        id_item,
        id_user: req.user.id,
      },
    });
    if (isExist) {
      if (quantity) {
        if (quantity <= 0) {
          res.status(400).json({ message: "Số lượng phải lớn hơn 0!" });
        } else {
          isExist.quantity = isExist.quantity + quantity;
          await isExist.save();
          res.status(201).json({ message: "Đã thêm vào giỏ hàng!" });
        }
      } else {
        isExist.quantity = isExist.quantity + 1;
        await isExist.save();
        res.status(201).json({ message: "Đã thêm vào giỏ hàng!" });
      }
    } else {
      if (quantity) {
        await Cart.create({
          id_item,
          id_user: req.user.id,
          quantity: quantity,
        });
        res.status(201).json({ message: "Đã thêm vào giỏ hàng!" });
      } else {
        await Cart.create({
          id_item,
          id_user: req.user.id,
          quantity: 1,
        });
        res.status(201).json({ message: "Đã thêm vào giỏ hàng!" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const increaseNumItemInCart = async (req, res) => {
  const { id_item } = req.params;
  try {
    const itemInCart = await Cart.findOne({
      where: {
        id_item,
        id_user: req.user.id,
      },
    });
    itemInCart.quantity = itemInCart.quantity + 1;
    await itemInCart.save();
    res.status(201).json({ message: "Số lượng đã tăng thêm 1!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const decreaseNumItemInCart = async (req, res) => {
  const { id_item } = req.params;
  try {
    const itemInCart = await Cart.findOne({
      where: {
        id_item,
        id_user: req.user.id,
      },
    });
    if (itemInCart.quantity == 1) {
      await Cart.destroy({
        where: {
          id_item,
          id_user: req.user.id,
        },
      });
      res.status(201).json({ message: "Đã xoá khỏi giỏ hàng!" });
    } else {
      itemInCart.quantity = itemInCart.quantity - 1;
      await itemInCart.save();
      res.status(201).json({ message: "Số lượng đã giảm đi 1!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOneItemInCart = async (req, res) => {
  const { id_item } = req.params;
  try {
    await Cart.destroy({
      where: {
        id_item,
        id_user: req.user.id,
      },
    });
    res.status(201).json({ message: "Đã xoá khỏi giỏ hàng!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkout = async (req, res) => {
  const { id_payment, description, userLat, userLng, code } = req.body;
  try {
    const itemInCartList = await Cart.findAll({
      where: {
        id_user: req.user.id,
      },
    });
    if (itemInCartList.length) {
      const date = new Date();
      date.setHours(date.getHours() + 7);
      let random = getDistanceFromLatLonInKm(
        userLat,
        userLng,
        storeLat,
        storeLng
      );
      if (random > 10) {
        res
          .status(400)
          .json({ message: "Hệ thống không hỗ trợ giao trên 10km" });
      } else {
        if (random < 2) {
          random = deli_unit_price * 5;
        } else if (random >= 2 && random < 5) {
          random = deli_unit_price * 5 + 5000;
        } else {
          random = deli_unit_price * 5 + 10000;
        }
        random = Math.ceil(random / 1000) * 1000;
        const info = await Cart.sequelize.query(
          "SELECT SUM((C.quantity*I.price)) as itemFee, SUM(C.quantity) as itemQuantity FROM carts as C, items as I where C.id_item = I.id_item AND C.id_user = :id_user",
          {
            replacements: { id_user: req.user.id },
            type: QueryTypes.SELECT,
          }
        );
        if (code) {
          const discount = await Discount.findOne({
            where: {
              code,
            },
          });
          if (info[0].itemQuantity >= discount.min_quantity) {
            discount.quantity = discount.quantity - 1;
            await discount.save();
            const newOrder = await Order.create({
              id_user: req.user.id,
              id_payment,
              description,
              delivery_fee: random,
              item_fee: Number(info[0].itemFee),
              total:
                Number(info[0].itemFee) +
                (Number(info[0].itemFee) * discount.discount_percent) / 100 +
                random,
              time_order: date,
              status: 0,
            });
            let i = 0;
            while (itemInCartList[i]) {
              await Order_detail.create({
                id_order: newOrder.id_order,
                id_item: itemInCartList[i].id_item,
                quantity: itemInCartList[i].quantity,
                reviewed: 0,
              });
              await Cart.destroy({
                where: {
                  id_item: itemInCartList[i].id_item,
                  id_user: itemInCartList[i].id_user,
                },
              });
              i++;
            }
            res.status(201).json({ message: "Đặt hàng thành công!" });
          } else {
            res.status(400).json({
              message: "Số lượng sản phẩm chưa đạt yêu cầu của mã giảm giá!",
            });
          }
        } else {
          const newOrder = await Order.create({
            id_user: req.user.id,
            description,
            id_payment,
            delivery_fee: random,
            item_fee: Number(info[0].itemFee),
            total: Number(Number(info[0].itemFee) + random),
            time_order: date,
            status: 0,
          });
          let i = 0;
          while (itemInCartList[i]) {
            await Order_detail.create({
              id_order: newOrder.id_order,
              id_item: itemInCartList[i].id_item,
              quantity: itemInCartList[i].quantity,
              reviewed: 0,
            });
            await Cart.destroy({
              where: {
                id_item: itemInCartList[i].id_item,
                id_user: itemInCartList[i].id_user,
              },
            });
            i++;
          }
          res.status(201).json({ message: "Đặt hàng thành công!" });
        }
      }
    } else {
      res.status(400).json({ message: "Giỏ hàng của bạn đang trống!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = {
  getAllItemInCart,
  createItemInCart,
  increaseNumItemInCart,
  decreaseNumItemInCart,
  deleteOneItemInCart,
  checkout,
};
