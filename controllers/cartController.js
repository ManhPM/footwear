const {
  Cart,
  Item,
  Invoice,
  Invoice_detail,
  Item_detail,
} = require('../models');
const { QueryTypes } = require('sequelize');
const storeLat = 10.848881;
const storeLng = 106.787017;

const getAllItemInCart = async (req, res) => {
  try {
    let cartProducts = [];
    cartProducts = await Cart.findAll({
      where: {
        id_customer: req.user.id_user,
      },
    });
    await Promise.all(
      cartProducts.map(async (item) => {
        const data = await Item_detail.findOne({
          where: {
            id_item_detail: item.id_item_detail,
          },
        });
        const itemName = await Item.findOne({
          where: {
            id_item: data.id_item,
          },
        });
        item.price = data.price;
        item.size = data.id_size;
        item.name = itemName.name;
        item.id_item = itemName.id_item;
      }),
    );
    res.status(200).json({ data: cartProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItemInCart = async (req, res) => {
  const { id_item_detail } = req.params;
  const { quantity } = req.body;
  try {
    const isExist = await Cart.findOne({
      where: {
        id_item_detail,
        id_customer: req.user.id_user,
      },
      raw: false,
    });
    if (isExist) {
      if (quantity) {
        isExist.quantity = isExist.quantity + quantity;
        await isExist.save();
        res.status(201).json({ message: 'Đã thêm vào giỏ hàng!' });
      } else {
        isExist.quantity = isExist.quantity + 1;
        await isExist.save();
        res.status(201).json({ message: 'Đã thêm vào giỏ hàng!' });
      }
    } else {
      if (quantity) {
        await Cart.create({
          id_item_detail,
          id_customer: req.user.id_user,
          quantity: quantity,
        });
        res.status(201).json({ message: 'Đã thêm vào giỏ hàng!' });
      } else {
        await Cart.create({
          id_item_detail,
          id_customer: req.user.id_user,
          quantity: 1,
        });
        res.status(201).json({ message: 'Đã thêm vào giỏ hàng!' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItemInCartAtStore = async (req, res) => {
  try {
    const itemList = await Item.sequelize.query(
      'SELECT I.id_item, I.type, I.name, I.image, I.size, I.price, I.description, I.brand, I.origin, I.material, I.status, C.quantity FROM carts as C, items as I WHERE I.id_item = C.id_item AND C.id_customer = :id_customer',
      {
        replacements: { id_customer: 1 },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createItemInCartAtStore = async (req, res) => {
  const { id_item } = req.params;
  const { quantity } = req.body;
  try {
    const isExist = await Cart.findOne({
      where: {
        id_item,
        id_customer: 1,
      },
      raw: false,
    });
    if (isExist) {
      if (quantity) {
        isExist.quantity = isExist.quantity + quantity;
        await isExist.save();
        res.status(201).json({ message: 'Đã thêm vào giỏ hàng!' });
      } else {
        isExist.quantity = isExist.quantity + 1;
        await isExist.save();
        res.status(201).json({ message: 'Đã thêm vào giỏ hàng!' });
      }
    } else {
      if (quantity) {
        await Cart.create({
          id_item,
          id_customer: 1,
          quantity: quantity,
        });
        res.status(201).json({ message: 'Đã thêm vào giỏ hàng!' });
      } else {
        await Cart.create({
          id_item,
          id_customer: 1,
          quantity: 1,
        });
        res.status(201).json({ message: 'Đã thêm vào giỏ hàng!' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const increaseNumItemInCartAtStore = async (req, res) => {
  const { id_item } = req.params;
  try {
    const itemInCart = await Cart.findOne({
      where: {
        id_item,
        id_customer: 1,
      },
      raw: false,
    });
    itemInCart.quantity = itemInCart.quantity + 1;
    await itemInCart.save();
    res.status(201).json({ message: 'Số lượng đã tăng thêm 1!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const decreaseNumItemInCartAtStore = async (req, res) => {
  const { id_item } = req.params;
  try {
    const itemInCart = await Cart.findOne({
      where: {
        id_item,
        id_customer: 1,
      },
      raw: false,
    });
    if (itemInCart.quantity == 1) {
      await Cart.destroy({
        where: {
          id_item,
          id_customer: 1,
        },
      });
      res.status(201).json({ message: 'Đã xoá khỏi giỏ hàng!' });
    } else {
      itemInCart.quantity = itemInCart.quantity - 1;
      await itemInCart.save();
      res.status(201).json({ message: 'Số lượng đã giảm đi 1!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOneItemInCartAtStore = async (req, res) => {
  const { id_item } = req.params;
  try {
    await Cart.destroy({
      where: {
        id_item,
        id_customer: 1,
      },
    });
    res.status(201).json({ message: 'Đã xoá khỏi giỏ hàng!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkoutAtStore = async (req, res) => {
  try {
    const itemInCartList = await Item.sequelize.query(
      'SELECT I.id_item, I.type, I.name, I.image, I.size, I.price, I.description, I.brand, I.origin, I.material, I.status, I.quantity, C.quantity as cart_quantity FROM carts as C, items as I WHERE I.id_item = C.id_item AND C.id_customer = :id_customer',
      {
        replacements: { id_customer: 1 },
        type: QueryTypes.SELECT,
        raw: true,
      },
    );
    let i = 0;
    let check = 0;
    let checkNotEnough = 0;
    while (i < itemInCartList.length) {
      if (itemInCartList[i].id_status != 1 || itemInCartList.quantity == 0) {
        await Cart.destroy({
          where: {
            id_item: itemInCartList[i].id_item,
            id_customer: req.user.id_user,
          },
        });
        check = 1;
      }
      if (itemInCartList[i].quantity < itemInCartList.cart_quantity) {
        await Cart.destroy({
          where: {
            id_item: itemInCartList[i].id_item,
            id_customer: req.user.id_user,
          },
        });
        checkNotEnough = 1;
      }
      i++;
    }
    if (check || checkNotEnough) {
      res.status(400).json({
        message:
          'Trong giỏ hàng có sản phẩm không đủ hàng hoặc đã ngừng kinh doanh, vui lòng đặt hàng lại!',
      });
    } else {
      if (itemInCartList.length) {
        const date = new Date();
        date.setHours(date.getHours() + 7);
        const total = 0;
        await Promise.all(
          itemInCartList.map(async (item) => {
            total += itemInCartList.price * itemInCartList.quantity;
          }),
        );
        const newInvoice = await Invoice.create({
          id_customer: 1,
          description: 'Khách mua tại cửa hàng',
          address: 'Khách mua tại cửa hàng',
          id_payment_method: 2,
          ship_fee: 0,
          item_fee: Number(info[0].itemFee),
          total: Number(info[0].itemFee),
          datetime: date,
          id_status: 0,
          payment_status: 0,
        });
        i = 0;
        while (i < itemInCartList.length) {
          await Invoice_detail.create({
            id_invoice: newInvoice.id_invoice,
            id_item: itemInCartList[i].id_item,
            quantity: itemInCartList[i].cart_quantity,
            unit_price: itemInCartList[i].price,
          });
          await Cart.destroy({
            where: {
              id_item: itemInCartList[i].id_item,
              id_customer: 1,
            },
          });
          i++;
        }
        res.status(201).json({ message: 'Tạo đơn thành công!' });
      } else {
        res.status(400).json({ message: 'Giỏ hàng của bạn đang trống!' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const increaseNumItemInCart = async (req, res) => {
  const { id_item_detail } = req.params;
  try {
    const itemInCart = await Cart.findOne({
      where: {
        id_item_detail,
        id_customer: req.user.id_user,
      },
      raw: false,
    });
    itemInCart.quantity = itemInCart.quantity + 1;
    await itemInCart.save();
    res.status(201).json({ message: 'Số lượng đã tăng thêm 1!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const decreaseNumItemInCart = async (req, res) => {
  const { id_item_detail } = req.params;
  try {
    const itemInCart = await Cart.findOne({
      where: {
        id_item_detail,
        id_customer: req.user.id_user,
      },
      raw: false,
    });
    if (itemInCart.quantity == 1) {
      await Cart.destroy({
        where: {
          id_item_detail,
          id_customer: req.user.id_user,
        },
      });
      res.status(201).json({ message: 'Đã xoá khỏi giỏ hàng!' });
    } else {
      itemInCart.quantity = itemInCart.quantity - 1;
      await itemInCart.save();
      res.status(201).json({ message: 'Số lượng đã giảm đi 1!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOneItemInCart = async (req, res) => {
  const { id_item_detail } = req.params;
  try {
    await Cart.destroy({
      where: {
        id_item_detail,
        id_customer: req.user.id_user,
      },
    });
    res.status(201).json({ message: 'Đã xoá khỏi giỏ hàng!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkout = async (req, res) => {
  const { id_payment_method, description, userLat, userLng, address } =
    req.body;
  try {
    let itemInCartList = [];
    itemInCartList = await Cart.findAll({
      where: {
        id_customer: req.user.id_user,
      },
    });
    await Promise.all(
      itemInCartList.map(async (item) => {
        const data = await Item_detail.findOne({
          where: {
            id_item_detail: item.id_item_detail,
          },
        });
        const itemName = await Item.findOne({
          where: {
            id_item: data.id_item,
          },
        });
        item.price = data.price;
        item.size = data.id_size;
        item.name = itemName.name;
        item.id_item = itemName.id_item;
        item.item_quantity = data.quantity;
        item.status = itemName.id_status;
      }),
    );

    let i = 0;
    let check = 0;
    let checkNotEnough = 0;
    while (i < itemInCartList.length) {
      if (itemInCartList[i].status != 1 || itemInCartList.quantity == 0) {
        await Cart.destroy({
          where: {
            id_item_detail: itemInCartList[i].id_item_detail,
            id_customer: req.user.id_user,
          },
        });
        check = 1;
      }
      if (itemInCartList[i].item_quantity < itemInCartList.quantity) {
        await Cart.destroy({
          where: {
            id_item_detail: itemInCartList[i].id_item_detail,
            id_customer: req.user.id_user,
          },
        });
        checkNotEnough = 1;
      }
      i++;
    }
    if (check || checkNotEnough) {
      res.status(400).json({
        message:
          'Trong giỏ hàng của bạn có sản phẩm không đủ hàng hoặc đã ngừng kinh doanh, vui lòng đặt hàng lại!',
      });
    } else {
      if (itemInCartList.length) {
        const date = new Date();
        date.setHours(date.getHours() + 7);
        let random = getDistanceFromLatLonInKm(
          userLat,
          userLng,
          storeLat,
          storeLng,
        );
        if (random < 50) {
          random = 35000;
        } else {
          random = 40000;
        }
        let total = 0;
        await Promise.all(
          itemInCartList.map(async (item) => {
            total += itemInCartList.price * itemInCartList.quantity;
          }),
        );
        const newInvoice = await Invoice.create({
          id_customer: req.user.id_user,
          description,
          address,
          id_payment_method,
          ship_fee: random,
          item_fee: total,
          total: total + random,
          datetime: date,
          id_status: 1,
          payment_status: 0,
        });
        i = 0;
        while (i < itemInCartList.length) {
          await Invoice_detail.create({
            id_invoice: newInvoice.id_invoice,
            id_item_detail: itemInCartList[i].id_item_detail,
            quantity: itemInCartList[i].quantity,
            unit_price: itemInCartList[i].price,
          });
          await Cart.destroy({
            where: {
              id_item_detail: itemInCartList[i].id_item_detail,
              id_customer: req.user.id_user,
            },
          });
          i++;
        }
        res
          .status(201)
          .json({ message: 'Đặt hàng thành công!', data: newInvoice });
      } else {
        res.status(400).json({ message: 'Giỏ hàng của bạn đang trống!' });
      }
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
  getAllItemInCartAtStore,
  createItemInCartAtStore,
  increaseNumItemInCartAtStore,
  decreaseNumItemInCartAtStore,
  deleteOneItemInCartAtStore,
  checkoutAtStore,
};
