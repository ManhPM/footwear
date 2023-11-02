const { Order, Order_detail, Item } = require("../models");
const { QueryTypes } = require("sequelize");

const getAllOrder = async (req, res) => {
  try {
    if (req.user.role == "Khách hàng") {
      const orderList = await Order.sequelize.query(
        "SELECT O.*, P.name as name_payment FROM orders as O, payment_methods as P WHERE P.id_payment = O.id_payment AND O.id_user = :id_user ORDER BY O.id_order DESC",
        {
          replacements: { id_user: req.user.id },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).json({ data: orderList });
    } else if (req.user.role == "Giao hàng") {
      const orderList = await Order.sequelize.query(
        "SELECT O.*, P.name as name_payment FROM orders as O, payment_methods as P WHERE P.id_payment = O.id_payment AND O.id_shipper = :id_shipper ORDER BY O.id_order DESC",
        {
          replacements: { id_shipper: req.user.id },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).json({ data: orderList });
    } else {
      const { status } = req.query;
      if (status) {
        const orderList = await Order.sequelize.query(
          "SELECT O.*, U.fullName, P.name as name_payment FROM orders as O, users as U, payment_methods as P WHERE P.id_payment = O.id_payment AND U.id_user = O.id_user AND O.status = :status ORDER BY O.id_order DESC",
          {
            replacements: { status: status },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ data: orderList });
      } else {
        const orderList = await Order.sequelize.query(
          "SELECT O.*, U.fullName, P.name as name_payment FROM orders as O, users as U, payment_methods as P WHERE P.id_payment = O.id_payment AND U.id_user = O.id_user ORDER BY O.id_order DESC",
          {
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ data: orderList });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const receiveOrder = async (req, res) => {
  const { id_order } = req.params;
  try {
    const order = await Order.findOne({
      where: {
        id_order,
      },
    });
    if (order.status == 1) {
      const check = await Order.findOne({
        where: {
          status: 3,
          id_shipper: req.user.id,
        },
      });
      if (!check) {
        const date = new Date();
        date.setHours(date.getHours() + 7);
        order.id_shipper = req.user.id;
        order.time_shipper_receive = date;
        order.status = 3;
        await order.save();
        res.status(200).json({
          message: "Nhận đơn thành công!",
        });
      } else {
        res.status(400).json({
          message: "Đang có đơn chưa giao không thể nhận thêm!",
        });
      }
    } else if (order.status == 3) {
      const date = new Date();
      date.setHours(date.getHours() + 7);
      order.time_shipper_delivered = date;
      order.status = 4;
      await order.save();
      res.status(200).json({
        message: "Đơn hàng giao thành công!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItemInOrder = async (req, res) => {
  const { id_order } = req.params;
  try {
    const itemList = await Order.sequelize.query(
      "SELECT OD.*, I.numberOfVolumes, I.image, I.name, I.price, (I.price*OD.quantity) as amount FROM orders as O, order_details as OD, items as I WHERE O.id_order = OD.id_order AND OD.id_item = I.id_item AND O.id_order = :id_order",
      {
        replacements: { id_order: id_order },
        type: QueryTypes.SELECT,
      }
    );
    const order = await Order.sequelize.query(
      "SELECT O.*, U.fullName, P.name as name_payment FROM orders as O, users as U, payment_methods as P WHERE P.id_payment = O.id_payment AND U.id_user = O.id_user AND O.id_order = :id_order",
      {
        replacements: { id_order: id_order },
        type: QueryTypes.SELECT,
      }
    );
    res.status(200).json({
      info: order[0],
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmOrder = async (req, res) => {
  const { id_order } = req.params;
  try {
    const order = await Order.findOne({
      where: {
        id_order,
      },
    });
    if (order.status == 0) {
      const itemListInOrder = await Order_detail.findAll({
        where: {
          id_order,
        },
      });
      let i = 0;
      let check = 1;
      while (itemListInOrder[i]) {
        const item = await Item.findOne({
          where: {
            id_item: itemListInOrder[i].id_item,
          },
        });
        if (item.quantity >= itemListInOrder[i].quantity) {
          i++;
        } else {
          check = 0;
          break;
        }
      }
      if (check) {
        let j = 0;
        while (itemListInOrder[j]) {
          await Order.sequelize.query(
            "UPDATE items SET quantity = quantity - (:quantity) WHERE id_item = :id_item",
            {
              replacements: {
                id_item: itemListInOrder[j].id_item,
                quantity: itemListInOrder[j].quantity,
              },
              type: QueryTypes.UPDATE,
              raw: true,
            }
          );
          j++;
        }
        order.status = 4;
        await order.save();
        res.status(201).json({
          message: "Hoàn thành đơn hàng!",
        });
      } else {
        res.status(400).json({
          message: "Số lượng sản phẩm không đủ. Không thể hoàn thành!",
        });
      }
    } else {
      res.status(400).json({
        message: "Thao tác thất bại. Đơn hàng đã được xác nhận!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Thao tác thất bại!" });
  }
};

const cancelOrder = async (req, res) => {
  const { id_order } = req.params;
  try {
    const order = await Order.findOne({
      where: {
        id_order,
      },
    });
    if (order.status == 0) {
      order.status = 2;
      await order.save();
      res.status(200).json({
        message: "Đơn hàng đã được huỷ bỏ!",
      });
    } else {
      res.status(400).json({
        message: "Thao tác thất bại. Đơn hàng đã được xác nhận hoặc đã huỷ!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Thao tác thất bại!" });
  }
};

const thongKeSanPham = async (req, res) => {
  const { tuNgay, denNgay } = req.query;
  console.log(tuNgay !== undefined);
  try {
    if (tuNgay !== undefined && denNgay !== undefined) {
      // Thống kê từ ngày tuNgay đến ngày denNgay
      const thongKe = await Order_detail.sequelize.query(
        "SELECT I.image, I.id_item, I.numberOfVolumes, I.name, I.price, (SELECT IFNULL(SUM(order_details.quantity),0) FROM order_details WHERE id_item = I.id_item) as sold, (SELECT IFNULL(SUM(order_details.quantity*I.price),0) FROM order_details WHERE id_item = I.id_item) as total FROM items as I, order_details as OD, orders as O WHERE O.status = 4 AND O.id_order = OD.id_order AND OD.id_item = I.id_item AND O.time_order BETWEEN :tuNgay AND :denNgay GROUP BY I.id_item ORDER BY total DESC",
        {
          replacements: {
            tuNgay: `${tuNgay}`,
            denNgay: `${denNgay}`,
          },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      const total = await Order_detail.sequelize.query(
        "SELECT SUM(OD.quantity*I.price) as total FROM items as I, order_details as OD, orders as O WHERE O.status = 4 AND O.id_order = OD.id_order AND OD.id_item = I.id_item AND O.time_order BETWEEN :tuNgay AND :denNgay",
        {
          replacements: {
            tuNgay: `${tuNgay}`,
            denNgay: `${denNgay}`,
          },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).json({ data: thongKe, total: total[0].total });
    } else {
      // Thống kê từ trước đến nay
      const thongKe = await Order_detail.sequelize.query(
        "SELECT I.image, I.id_item, I.numberOfVolumes, I.name, I.price, (SELECT IFNULL(SUM(order_details.quantity),0) FROM order_details WHERE id_item = I.id_item) as sold, (SELECT IFNULL(SUM(order_details.quantity*I.price),0) FROM order_details WHERE id_item = I.id_item) as total FROM items as I, order_details as OD, orders as O WHERE O.status = 4 AND O.id_order = OD.id_order AND OD.id_item = I.id_item GROUP BY I.id_item ORDER BY total DESC",
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      const total = await Order_detail.sequelize.query(
        "SELECT SUM(OD.quantity*I.price) as total FROM items as I, order_details as OD, orders as O WHERE O.status = 4 AND O.id_order = OD.id_order AND OD.id_item = I.id_item",
        {
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).json({ data: thongKe, total: total[0].total });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllOrder,
  getAllItemInOrder,
  confirmOrder,
  cancelOrder,
  receiveOrder,
  thongKeSanPham,
};
