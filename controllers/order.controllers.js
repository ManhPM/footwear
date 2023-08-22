const {
  Order,
  Order_detail,
  Item_store,
  Report,
  Report_detail,
  Payment_method
} = require("../models");
const { QueryTypes } = require("sequelize");

const getAllOrder = async (req, res) => {
  const { id_order, status } = req.query;
  const {flag} = req.params
  const staff = await Order.sequelize.query(
    "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
    {
      replacements: { username: `${req.username}` },
      type: QueryTypes.SELECT,
      raw: true,
    }
  );
  try {
    if (req.id_role == 1) {
      //US
      const customer = await Order.sequelize.query(
        "SELECT CU.* FROM customers as CU, accounts as A WHERE A.username = :username AND CU.id_account = A.id_account",
        {
          replacements: { username: `${req.username}` },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      if(status){
        if(id_order){
          const orderList = await Order.sequelize.query(
            "SELECT O.id_order, O.delivery_fee, O.discount_fee, O.item_fee, O.total, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order FROM orders as O WHERE O.id_customer = :id_customer AND O.status = :status AND O.id_order = :id_order",
            {
              replacements: { id_customer: customer[0].id_customer, status, id_order },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ orderList });
        }
        else{
          const orderList = await Order.sequelize.query(
            "SELECT O.id_order, O.delivery_fee, O.discount_fee, O.item_fee, O.total, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order FROM orders as O WHERE O.id_customer = :id_customer AND O.status = :status",
            {
              replacements: { id_customer: customer[0].id_customer, status },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ orderList });
        }
      }
      else{
        if(id_order){
          const orderList = await Order.sequelize.query(
            "SELECT O.id_order, O.delivery_fee, O.discount_fee, O.item_fee, O.total, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order FROM orders as O WHERE O.id_customer = :id_customer AND O.id_order = :id_order",
            {
              replacements: { id_customer: customer[0].id_customer, id_order },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ orderList });
        }
        else{
          const orderList = await Order.sequelize.query(
            "SELECT O.id_order, O.delivery_fee, O.discount_fee, O.item_fee, O.total, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order FROM orders as O WHERE O.id_customer = :id_customer ORDER BY O.status ASC",
            {
              replacements: { id_customer: customer[0].id_customer },
              type: QueryTypes.SELECT,
              raw: true,
            }
          );
          res.status(200).json({ orderList });
        }
      }
    } else if (req.id_role == 5) {
      //AD
      const orderList = await Order.sequelize.query(
        "SELECT (SELECT name FROM shippers WHERE id_shipper = O.id_shipper) as name_shipper, (SELECT name FROM shipping_partners WHERE id_shipping_partner = O.id_shipping_partner) as name_shipping_partner, O.id_order, O.delivery_fee, O.item_fee, O.total, (SELECT name FROM customers WHERE id_customer = O.id_customer) as name_customer, C.phone, O.description, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, P.name as name_payment FROM orders as O, customers as C, payment_methods as P WHERE O.id_customer = C.id_customer AND O.id_payment = P.id_payment ORDER BY O.status ASC",
        {
          replacements: { id_order, id_store: staff[0].id_store },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      if(flag == 1){
        res.status(200).render("order/order-print", { orderList, id_role: req.id_role });
      }
      else{
        res.status(200).render("order/order", { orderList, id_role: req.id_role });
      }
    } else if (req.id_role == 3 || req.id_role == 2) {
      // NV
      const orderList = await Order.sequelize.query(
        "SELECT (SELECT name FROM shippers WHERE id_shipper = O.id_shipper) as name_shipper, (SELECT name FROM shipping_partners WHERE id_shipping_partner = O.id_shipping_partner) as name_shipping_partner, O.id_order, O.delivery_fee, O.item_fee, O.total, C.name as name_customer, C.phone, O.description, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, P.name as name_payment FROM orders as O, customers as C, payment_methods as P WHERE O.id_customer = C.id_customer AND O.id_payment = P.id_payment AND O.id_store = :id_store ORDER BY O.status ASC",
        {
          replacements: { id_store: staff[0].id_store },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      if(flag == 1){
        res.status(200).render("order/order-print", { orderList, id_role: req.id_role });
      }
      else{
        res.status(200).render("order/order", { orderList, id_role: req.id_role });
      }

    } else {
      // SP
      const shipper = await Order.sequelize.query(
        "SELECT S.* FROM shippers as S, accounts as A WHERE A.username = :username AND S.id_account = A.id_account",
        {
          replacements: { username: `${req.username}` },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      const orderList = await Order.sequelize.query(
        "SELECT (SELECT name FROM shipping_partners WHERE id_shipping_partner = O.id_shipping_partner) as name_shipping_partner, O.id_order, C.name as name_customer, C.phone, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, P.name as name_payment FROM orders as O, customers as C, payment_methods as P, shippers AS S WHERE O.id_customer = C.id_customer AND O.id_payment = P.id_payment AND O.status != 1 AND O.status != 2 AND O.status != 0 AND O.id_shipping_partner = S.id_shipping_partner AND O.id_shipper = :id_shipper ORDER BY O.time_order DESC",
        {
          replacements: { id_shipper: shipper[0].id_shipper },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).render("order/order", { orderList, flag: 2, id_role: req.id_role });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllOrderForShipper = async (req, res) => {
  try {
    const shipper = await Order.sequelize.query(
      "SELECT S.* FROM shippers as S, accounts as A WHERE A.username = :username AND S.id_account = A.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const orderList = await Order.sequelize.query(
      "SELECT O.id_order, O.delivery_fee, O.item_fee, O.total, C.name as name_customer, C.phone, O.description, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, P.name as name_payment FROM orders as O, customers as C, payment_methods as P, shippers as S WHERE O.id_customer = C.id_customer AND O.id_payment = P.id_payment AND O.id_shipping_partner = :id_shipping_partner AND O.status = 1 GROUP BY O.id_order ORDER BY O.time_order DESC",
      {
        replacements: {
          id_shipping_partner: shipper[0].id_shipping_partner,
          id_role: req.id_role,
        },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("order/order", { orderList, flag: 1, id_role: req.id_role });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
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
    const shipper = await Order.sequelize.query(
      "SELECT S.* FROM shippers as S, accounts as A WHERE A.username = :username AND S.id_account = A.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if (order.status == 1) {
      const check = await Order.findOne({
        where: {
          status: 3,
          id_shipper: shipper[0].id_shipper,
        },
      });
      if (!check) {
        const date = new Date();
        date.setHours(date.getHours() + 7);
        order.id_shipper = shipper[0].id_shipper;
        order.time_shipper_receive = date;
        order.status = 3;
        await order.save();
        res.status(200).render("order/order-notification", {
          message: "Nhận đơn thành công!",
        });
      } else {
        res.status(200).render("order/order-notification", {
          message: "Đang có đơn chưa giao không thể nhận thêm!",
        });
      }
    } else if (order.status == 3) {
      const date = new Date();
      date.setHours(date.getHours() + 7);
      order.time_shipper_delivered = date;
      order.status = 4;
      await order.save();
      res.status(200).render("order/order-notification", {
        message: "Đơn hàng giao thành công!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllDetailOrder = async (req, res) => {
  const { id_order } = req.params;
  try {
    const itemList = await Order.sequelize.query(
      "SELECT OD.*, I.image, I.name, I.price, (I.price*OD.quantity) as amount FROM orders as O, order_details as OD, items as I WHERE O.id_order = OD.id_order AND OD.id_item = I.id_item AND O.id_order = :id_order",
      {
        replacements: { id_order: id_order },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const order = await Order.sequelize.query(
      "SELECT (SELECT name FROM shippers WHERE id_shipper = O.id_shipper) as name_shipper, (SELECT name FROM shipping_partners WHERE id_shipping_partner = O.id_shipping_partner) as name_shipping_partner, O.id_order, O.delivery_fee, O.item_fee, O.total, C.name as name_customer, C.phone, O.description, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, P.name as name_payment FROM orders as O, customers as C, payment_methods as P WHERE O.id_customer = C.id_customer AND O.id_payment = P.id_payment AND O.id_order = :id_order",
      {
        replacements: { id_order: id_order },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
      res
        .status(200)
        .render("order/order-detail", {
          info: order[0],
          itemList,
          id_role: req.id_role,
        });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllItemInOrder = async (req, res) => {
  const { id_order, flag } = req.params;
  try {
    const itemList = await Order.sequelize.query(
      "SELECT OD.*, I.image, I.name, I.price, (I.price*OD.quantity) as amount FROM orders as O, order_details as OD, items as I WHERE O.id_order = OD.id_order AND OD.id_item = I.id_item AND O.id_order = :id_order",
      {
        replacements: { id_order: id_order },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const order = await Order.sequelize.query(
      "SELECT (SELECT name FROM shippers WHERE id_shipper = O.id_shipper) as name_shipper, (SELECT name FROM shipping_partners WHERE id_shipping_partner = O.id_shipping_partner) as name_shipping_partner, O.id_order, O.delivery_fee, O.item_fee, O.total, C.name as name_customer, C.phone, O.description, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, P.name as name_payment FROM orders as O, customers as C, payment_methods as P WHERE O.id_customer = C.id_customer AND O.id_payment = P.id_payment AND O.id_order = :id_order",
      {
        replacements: { id_order: id_order },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if (req.id_role == 5) {
      res
        .status(200)
        .render("order/order-detail-admin", {
          info: order[0],
          itemList,
          id_role: req.id_role,
        });
    } else if (req.id_role == 1) {
      res.status(200).json({ info: order[0], itemList });
    } else if (req.id_role == 4) {
      res.status(200).render("order/order-detail-deliver", {
        info: order[0],
        itemList,
        flag: 1,
        id_role: req.id_role,
      });
    } else {
      if(flag){
        res
        .status(200)
        .render("order/order-detail-print", {
          info: order[0],
          itemList,
          id_role: req.id_role,
        });
      }
      else{
        res
        .status(200)
        .render("order/order-detail-staff", {
          info: order[0],
          itemList,
          id_role: req.id_role,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};


const getAllItemInOrderToChange = async (req, res) => {
  const { id_order } = req.params;
  try {
    const itemList = await Order.sequelize.query(
      "SELECT OD.*, I.image, I.name, I.price, (I.price*OD.quantity) as amount FROM orders as O, order_details as OD, items as I WHERE O.id_order = OD.id_order AND OD.id_item = I.id_item AND O.id_order = :id_order",
      {
        replacements: { id_order: id_order },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const order = await Order.sequelize.query(
      "SELECT (SELECT name FROM shippers WHERE id_shipper = O.id_shipper) as name_shipper, (SELECT name FROM shipping_partners WHERE id_shipping_partner = O.id_shipping_partner) as name_shipping_partner, O.id_order, O.delivery_fee, O.item_fee, O.total, C.name as name_customer, C.phone, O.description, O.status, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, P.name as name_payment FROM orders as O, customers as C, payment_methods as P WHERE O.id_customer = C.id_customer AND O.id_payment = P.id_payment AND O.id_order = :id_order",
      {
        replacements: { id_order: id_order },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
      res
        .status(200)
        .render("order/order-detail", {
          info: order[0],
          itemList,
          id_role: req.id_role,
        });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
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
      if(order.id_shipping_partner){
        const itemListInOrder = await Order_detail.findAll({
          where: {
            id_order,
          },
        });
        const staff = await Order.sequelize.query(
          "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
          {
            replacements: { username: `${req.username}` },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        let i = 0;
        let check = 0;
        while (itemListInOrder[i]) {
          const itemOfStore = await Item_store.findOne({
            where: {
              id_item: itemListInOrder[i].id_item,
              id_store: staff[0].id_store,
            },
          });
          if (itemOfStore.quantity >= itemListInOrder[i].quantity) {
            i++;
          } else {
            check = 1;
            break;
          }
        }
        if (check == 0) {
          let j = 0;
          while (itemListInOrder[j]) {
            await Order.sequelize.query(
              "UPDATE item_stores SET quantity = quantity - (:quantity) WHERE id_item = :id_item AND id_store = :id_store",
              {
                replacements: {
                  id_item: itemListInOrder[j].id_item,
                  quantity: itemListInOrder[j].quantity,
                  id_store: staff[0].id_store,
                },
                type: QueryTypes.UPDATE,
                raw: true,
              }
            );
            j++;
          }
          order.status = 1;
          await order.save();
          res
            .status(201)
            .render("order/order-notification", {
              message: "Xác nhận đơn hàng!",
            });
        } else {
          res
            .status(400)
            .render("order/order-notification", {
              message: "Số lượng sản phẩm không đủ. Không thể hoàn thành đơn!",
            });
        }
      }
      else{
        const itemListInOrder = await Order_detail.findAll({
          where: {
            id_order,
          },
        });
        const staff = await Order.sequelize.query(
          "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
          {
            replacements: { username: `${req.username}` },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        let i = 0;
        let check = 0;
        while (itemListInOrder[i]) {
          const itemOfStore = await Item_store.findOne({
            where: {
              id_item: itemListInOrder[i].id_item,
              id_store: staff[0].id_store,
            },
          });
          if (itemOfStore.quantity >= itemListInOrder[i].quantity) {
            i++;
          } else {
            check = 1;
            break;
          }
        }
        if (check == 0) {
          let j = 0;
          while (itemListInOrder[j]) {
            await Order.sequelize.query(
              "UPDATE item_stores SET quantity = quantity - (:quantity) WHERE id_item = :id_item AND id_store = :id_store",
              {
                replacements: {
                  id_item: itemListInOrder[j].id_item,
                  quantity: itemListInOrder[j].quantity,
                  id_store: staff[0].id_store,
                },
                type: QueryTypes.UPDATE,
                raw: true,
              }
            );
            j++;
          }
          order.status = 4;
          await order.save();
          res
            .status(201)
            .render("order/order-notification", {
              message: "Hoàn thành đơn hàng!",
            });
        } else {
          res
            .status(400)
            .render("order/order-notification", {
              message: "Số lượng sản phẩm không đủ. Không thể hoàn thành!",
            });
        }
      }
    } else {
      res
        .status(400)
        .render("order/order-notification", {
          message: "Thao tác thất bại. Đơn hàng đã được xác nhận!",
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Thao tác thất bại!" });
  }
};

const updateOrder = async (req, res) => {
  const {id_order} = req.params
  const {description} = req.body
  try {
    const update = await Order.findOne({
      where: {
        id_order
      }
    });
    update.description = description
    await update.save();
    const item = await Order.findOne({
      raw: true,
      where: {
        id_order
      }
    });
    console.log(item)
    res.status(201).render("order/order-create",{item,message: "Cập nhật thành công!",flag: 2})
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
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
      res
        .status(200)
        .render("order/order-notification", {
          message: "Đơn hàng đã được huỷ bỏ!",
        });
    } else {
      res.status(400).render("order/order-notification", {
        message: "Thao tác thất bại. Đơn hàng đã được xác nhận hoặc đã huỷ!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Thao tác thất bại!" });
  }
};

const thongKeSanPham = async (req, res) => {
  const { tuNgay, denNgay } = req.query;
  try {
    const staff = await Order.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if (tuNgay && denNgay) {
      // Thống kê từ ngày tuNgay đến ngày denNgay
      const thongKe = await Order_detail.sequelize.query(
        "SELECT (SELECT SUM(order_details.quantity) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0 AND orders.time_order BETWEEN :tuNgay AND :denNgay) as sold, (SELECT (SUM(order_details.quantity)*items.price) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0 AND orders.time_order BETWEEN :tuNgay AND :denNgay) as total, I.*, T.name AS name_type FROM items as I, order_details as OD, types as T, orders as O WHERE OD.id_item = I.id_item AND O.id_order = OD.id_order AND T.id_type = I.id_type AND T.id_type != 4 AND I.status != 0 AND O.status = 4 AND O.id_store = :id_store AND O.time_order BETWEEN :tuNgay AND :denNgay GROUP BY I.id_item ORDER BY sold DESC",
        {
          replacements: {
            tuNgay: `${tuNgay}`,
            denNgay: `${denNgay}`,
            id_store: staff[0].id_store,
          },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).json({ itemList: thongKe });
    } else {
      // Thống kê từ trước đến nay
      const thongKe = await Order_detail.sequelize.query(
        "SELECT (SELECT SUM(order_details.quantity) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0) as sold, (SELECT (SUM(order_details.quantity)*items.price) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0) as total, I.*, T.name AS name_type FROM items as I, order_details as OD, types as T, orders as O WHERE OD.id_item = I.id_item AND O.id_order = OD.id_order AND T.id_type = I.id_type AND T.id_type != 4 AND I.status != 0 AND O.status = 4 AND O.id_store = :id_store GROUP BY I.id_item ORDER BY sold DESC",
        {
          replacements: { id_store: staff[0].id_store },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).json({ itemList: thongKe });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createReport = async (req, res) => {
  try {
    const staff = await Order.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    console.log(1)
    const date = new Date();
    date.setHours(date.getHours() + 7);
    const itemList = await Order_detail.sequelize.query(
      "SELECT I.id_item, (SELECT SUM(order_details.quantity) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND DAY(orders.time_order) = DAY(current_date()) AND MONTH(orders.time_order) = MONTH(current_date()) AND YEAR(O.time_order) = YEAR(current_date())) as sold, (SELECT (SUM(order_details.quantity)*items.price) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND DAY(orders.time_order) = DAY(current_date()) AND MONTH(orders.time_order) = MONTH(current_date()) AND YEAR(O.time_order) = YEAR(current_date())) as total FROM order_details as OD, orders as O, items as I WHERE O.id_order = OD.id_order AND O.status = 4 AND OD.id_item = I.id_item AND O.id_store = :id_store AND DAY(O.time_order) = DAY(current_date()) AND MONTH(O.time_order) = MONTH(current_date()) AND YEAR(O.time_order) = YEAR(current_date()) GROUP BY I.id_item",
      {
        replacements: { id_store: staff[0].id_store },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    console.log(1)
    const doanhThu = await Order_detail.sequelize.query(
      "SELECT IFNULL(SUM(O.item_fee), 0) as total, COUNT(O.id_order) as countOrder FROM orders as O WHERE O.id_store = :id_store AND O.status = 4 AND DAY(O.time_order) = DAY(current_date()) AND MONTH(O.time_order) = MONTH(current_date()) AND YEAR(O.time_order) = YEAR(current_date())",
      {
        replacements: { id_store: staff[0].id_store },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const report = await Report.create({
      id_store: staff[0].id_store,
      revenue: doanhThu[0].total,
      date,
      countOrder: doanhThu[0].countOrder,
    });
    let i = 0;
    while (itemList[i]) {
      await Report_detail.create({
        id_report: report.id_report,
        id_item: itemList[i].id_item,
        sold: itemList[i].sold,
        total: itemList[i].total,
      });
      i++;
    }
    res.status(200).render("report/report-notification",{ message: "Tạo mới báo cáo thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const thongKeDonHang = async (req, res) => {
  const { tuNgay, denNgay, status } = req.query;
  try {
    const staff = await Order.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if (tuNgay && denNgay) {
      if (status) {
        // Thống kê từ ngày tuNgay đến ngày denNgay với status
        const orderList = await Order_detail.sequelize.query(
          "SELECT O.id_order, SP.name as name_shipping_partner, O.total, O.item_fee, O.delivery_fee, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, O.description, O.status, P.name as name_payment, C.name as name_customer FROM orders as O, customers as C, payment_methods as P, shipping_partners as SP WHERE O.time_order BETWEEN :tuNgay AND :denNgay AND O.id_store = :id_store AND O.id_payment = P.id_payment AND O.id_customer = C.id_customer AND O.id_shipping_partner = SP.id_shipping_partner AND O.status = :status",
          {
            replacements: {
              tuNgay: `${tuNgay}`,
              denNgay: `${denNgay}`,
              status: status,
              id_store: staff[0].id_store,
            },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({
          orderList,
        });
      } else {
        // Thống kê từ ngày tuNgay đến ngày denNgay
        const orderList = await Order_detail.sequelize.query(
          "SELECT O.id_order, SP.name as name_shipping_partner, O.total, O.item_fee, O.delivery_fee, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, O.description, O.status, P.name as name_payment, C.name as name_customer FROM orders as O, customers as C, payment_methods as P, shipping_partners as SP WHERE O.time_order BETWEEN :tuNgay AND :denNgay AND O.id_store = :id_store AND O.id_payment = P.id_payment AND O.id_customer = C.id_customer AND O.id_shipping_partner = SP.id_shipping_partner",
          {
            replacements: {
              tuNgay: `${tuNgay}`,
              denNgay: `${denNgay}`,
              id_store: staff[0].id_store,
            },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ orderList });
      }
    } else {
      // Thống kê từ trước đến nay
      if (status) {
        const orderList = await Order_detail.sequelize.query(
          "SELECT O.id_order, SP.name as name_shipping_partner, O.total, O.item_fee, O.delivery_fee, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, O.description, O.status, P.name as name_payment, C.name as name_customer FROM orders as O, customers as C, payment_methods as P, shipping_partners as SP WHERE O.id_store = :id_store AND O.id_payment = P.id_payment AND O.id_customer = C.id_customer AND O.id_shipping_partner = SP.id_shipping_partner AND O.status = :status",
          {
            replacements: { status: status, id_store: staff[0].id_store },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ orderList });
      } else {
        const orderList = await Order_detail.sequelize.query(
          "SELECT O.id_order, SP.name as name_shipping_partner, O.total, O.item_fee, O.delivery_fee, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, O.description, O.status, P.name as name_payment, C.name as name_customer FROM orders as O, customers as C, payment_methods as P, shipping_partners as SP WHERE O.id_store = :id_store AND O.id_payment = P.id_payment AND O.id_customer = C.id_customer AND O.id_shipping_partner = SP.id_shipping_partner",
          {
            replacements: { id_store: staff[0].id_store },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ orderList });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const dashboardManager = async (req, res) => {
  try {
    const staff = await Order.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const itemList = await Order_detail.sequelize.query(
      "SELECT (SELECT SUM(order_details.quantity) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0) as sold, (SELECT CONCAT(FORMAT((SUM(order_details.quantity)*items.price), 0)) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0) as total, I.name FROM items as I, order_details as OD, orders as O WHERE OD.id_item = I.id_item AND O.id_order = OD.id_order AND I.status != 0 AND O.status = 4 AND O.id_store = :id_store GROUP BY I.id_item ORDER BY sold DESC LIMIT 5",
      {
        replacements: { id_store: staff[0].id_store },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const orderList = await Order_detail.sequelize.query(
      "SELECT O.id_order, O.status, C.name, C.phone, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order FROM orders as O, customers as C, payment_methods as P, shipping_partners as SP WHERE O.id_store = :id_store AND O.id_payment = P.id_payment AND O.id_customer = C.id_customer AND O.id_shipping_partner = SP.id_shipping_partner ORDER BY O.time_order ASC LIMIT 3",
      {
        replacements: { id_store: staff[0].id_store },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    const info = await Order_detail.sequelize.query(
      "SELECT(SELECT COUNT(*) from orders WHERE orders.id_store = :id_store) as total, (SELECT COUNT(*) from orders WHERE orders.id_store = :id_store AND orders.status = 0) as un_confirm, (SELECT COUNT(*) from orders WHERE orders.id_store = :id_store AND orders.status = 4) as finished, (SELECT COUNT(*) from orders WHERE orders.id_store = :id_store AND orders.status = 2) as canceled, (SELECT COUNT(*) from orders WHERE orders.id_store = :id_store AND orders.status = 1) as confirmed, (SELECT COUNT(*) from orders WHERE orders.id_store = :id_store AND orders.status = 3) as delivering",
      {
        replacements: { id_store: staff[0].id_store },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const date = new Date();
    date.setHours(date.getHours() + 7);
    const chart = await Order_detail.sequelize.query(
      `SELECT(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 1) as jan,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 2) as feb,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 3) as mar,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 4) as apr,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 5) as may,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 6) as jun,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 7) as jul,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 8) as aug,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 9) as sep,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 10) as oct,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 11) as nov,(SELECT COUNT(*) from orders WHERE id_store = :id_store AND status = 4 AND YEAR(time_order) = YEAR(current_date()) AND MONTH(time_order) = 12) as "dec"`,
      {
        replacements: { id_store: staff[0].id_store },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const doanhThu = await Order_detail.sequelize.query(
      "SELECT (SELECT IFNULL(CONCAT(FORMAT(SUM(O.item_fee), 0)),0) FROM orders AS O WHERE O.status = 4 AND O.id_store = :id_store AND DAY(O.time_order) = DAY(current_date()) AND MONTH(O.time_order) = MONTH(current_date()) AND YEAR(O.time_order) = YEAR(current_date())) as totalDay, (SELECT IFNULL(CONCAT(FORMAT(SUM(O.item_fee), 0)),0) FROM orders AS O WHERE O.status = 4 AND O.id_store = :id_store AND MONTH(O.time_order) = MONTH(current_date()) AND YEAR(O.time_order) = YEAR(current_date())) as totalMonth, (SELECT COUNT(*) FROM orders AS O WHERE O.status = 4 AND O.id_store = :id_store AND DAY(O.time_order) = DAY(current_date()) AND MONTH(O.time_order) = MONTH(current_date()) AND YEAR(O.time_order) = YEAR(current_date())) as countOrderDay,(SELECT COUNT(*) FROM orders AS O WHERE O.status = 4 AND O.id_store = :id_store AND MONTH(O.time_order) = MONTH(current_date()) AND YEAR(O.time_order) = YEAR(current_date())) as countOrderMonth",
      {
        replacements: { id_store: staff[0].id_store },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("order/dashboard-manager", {
      orderList,
      itemList,
      info: info[0],
      chart: chart[0],
      revenue: doanhThu[0],
      id_role: req.id_role
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const thongKeSanPhamAdmin = async (req, res) => {
  const { tuNgay, denNgay, id_store } = req.query;
  try {
    if (tuNgay && denNgay) {
      // Thống kê từ ngày tuNgay đến ngày denNgay
      const thongKe = await Order_detail.sequelize.query(
        "SELECT (SELECT SUM(order_details.quantity) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0 AND orders.time_order BETWEEN :tuNgay AND :denNgay) as sold, (SELECT (SUM(order_details.quantity)*items.price) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0 AND orders.time_order BETWEEN :tuNgay AND :denNgay) as total, I.*, T.name AS name_type FROM items as I, order_details as OD, types as T, orders as O WHERE OD.id_item = I.id_item AND O.id_order = OD.id_order AND T.id_type = I.id_type AND T.id_type != 4 AND I.status != 0 AND O.status = 4 AND O.id_store = :id_store AND O.time_order BETWEEN :tuNgay AND :denNgay GROUP BY I.id_item ORDER BY sold DESC",
        {
          replacements: {
            tuNgay: `${tuNgay}`,
            denNgay: `${denNgay}`,
            id_store: id_store,
          },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).json({ itemList: thongKe });
    } else {
      // Thống kê từ trước đến nay
      const thongKe = await Order_detail.sequelize.query(
        "SELECT (SELECT SUM(order_details.quantity) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0) as sold, (SELECT (SUM(order_details.quantity)*items.price) FROM items, order_details, orders where order_details.id_item = I.id_item AND order_details.id_order = orders.id_order AND orders.status = 4 AND orders.id_store = :id_store AND order_details.id_item = items.id_item AND items.status != 0) as total, I.*, T.name AS name_type FROM items as I, order_details as OD, types as T, orders as O WHERE OD.id_item = I.id_item AND O.id_order = OD.id_order AND T.id_type = I.id_type AND T.id_type != 4 AND I.status != 0 AND O.status = 4 AND O.id_store = :id_store GROUP BY I.id_item ORDER BY sold DESC",
        {
          replacements: { id_store: id_store },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).json({ itemList: thongKe });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const thongKeDonHangAdmin = async (req, res) => {
  const { tuNgay, denNgay, status, id_store } = req.query;
  try {
    if (tuNgay && denNgay) {
      if (status) {
        // Thống kê từ ngày tuNgay đến ngày denNgay với status
        const orderList = await Order_detail.sequelize.query(
          "SELECT O.id_order, SP.name as name_shipping_partner, O.total, O.item_fee, O.delivery_fee, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, O.description, O.status, P.name as name_payment, C.name as name_customer FROM orders as O, customers as C, payment_methods as P, shipping_partners as SP WHERE O.time_order BETWEEN :tuNgay AND :denNgay AND O.id_store = :id_store AND O.id_payment = P.id_payment AND O.id_customer = C.id_customer AND O.id_shipping_partner = SP.id_shipping_partner AND O.status = :status",
          {
            replacements: {
              tuNgay: `${tuNgay}`,
              denNgay: `${denNgay}`,
              status: status,
              id_store: id_store,
            },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({
          orderList,
        });
      } else {
        // Thống kê từ ngày tuNgay đến ngày denNgay
        const orderList = await Order_detail.sequelize.query(
          "SELECT O.id_order, SP.name as name_shipping_partner, O.total, O.item_fee, O.delivery_fee, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, O.description, O.status, P.name as name_payment, C.name as name_customer FROM orders as O, customers as C, payment_methods as P, shipping_partners as SP WHERE O.time_order BETWEEN :tuNgay AND :denNgay AND O.id_store = :id_store AND O.id_payment = P.id_payment AND O.id_customer = C.id_customer AND O.id_shipping_partner = SP.id_shipping_partner",
          {
            replacements: {
              tuNgay: `${tuNgay}`,
              denNgay: `${denNgay}`,
              id_store: id_store,
            },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ orderList });
      }
    } else {
      // Thống kê từ trước đến nay
      if (status) {
        const orderList = await Order_detail.sequelize.query(
          "SELECT O.id_order, SP.name as name_shipping_partner, O.total, O.item_fee, O.delivery_fee, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, O.description, O.status, P.name as name_payment, C.name as name_customer FROM orders as O, customers as C, payment_methods as P, shipping_partners as SP WHERE O.id_store = :id_store AND O.id_payment = P.id_payment AND O.id_customer = C.id_customer AND O.id_shipping_partner = SP.id_shipping_partner AND O.status = :status",
          {
            replacements: { status: status, id_store: id_store },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ orderList });
      } else {
        const orderList = await Order_detail.sequelize.query(
          "SELECT O.id_order, SP.name as name_shipping_partner, O.total, O.item_fee, O.delivery_fee, DATE_FORMAT(O.time_order, '%d/%m/%Y %H:%i') as time_order, DATE_FORMAT(O.time_confirm, '%d/%m/%Y %H:%i') as time_confirm, DATE_FORMAT(O.time_shipper_receive, '%d/%m/%Y %H:%i') as time_shipper_receive, DATE_FORMAT(O.time_shipper_delivered, '%d/%m/%Y %H:%i') as time_shipper_delivered, O.description, O.status, P.name as name_payment, C.name as name_customer FROM orders as O, customers as C, payment_methods as P, shipping_partners as SP WHERE O.id_store = :id_store AND O.id_payment = P.id_payment AND O.id_customer = C.id_customer AND O.id_shipping_partner = SP.id_shipping_partner",
          {
            replacements: { id_store: id_store },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).json({ orderList });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createOrderDetailForm = async (req, res) => {
  const {id_order} = req.params
  try{
    const itemList = await Order.sequelize.query(
      "SELECT * FROM items WHERE id_item NOT IN(SELECT id_item FROM order_details WHERE id_order = :id_order)",
      {
        replacements: { id_order },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const item = await Order.findOne({
      where: {
        id_order,
      },
      raw: true
    })
    res.status(200).render("order/order-detail-create",{item, itemList, flag: 1});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getDetailOrder = async (req, res) => {
  const {id_order} = req.params
  try{
    const paymentList = await Payment_method.findAll({ raw: true });
    const item = await Order.findOne({
      where: {
        id_order,
      },
      raw: true
    })
    res.status(200).render("order/order-create", {
      paymentList,
      flag: 2,
      item
    });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createOrderDetail = async (req, res) => {
  const {id_order} = req.params
  const {quantity, id_item} = req.body
  try {
    const staff = await Order.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const checkQuantity = await Item_store.findOne({
      where: {
        id_item,
        id_store: staff[0].id_store
      }
    });
    if(checkQuantity.quantity >= quantity){
      await Order_detail.create({id_order, id_item, quantity, reviewed: 1})
      const item = await Order.findOne({
        where: {
          id_order,
        },
        raw: true
      })
      const total = await Order.sequelize.query(
        "SELECT IFNULL(SUM(OD.quantity*I.price),0) AS total FROM items as I, order_details as OD WHERE OD.id_item = I.id_item AND OD.id_order = :id_order",
        {
          replacements: { id_order },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      await Order.sequelize.query(
        "UPDATE orders SET total = :total, item_fee = :total WHERE id_order = :id_order",
        {
          replacements: { id_order, total: total[0].total },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      const itemList = await Order.sequelize.query(
        "SELECT * FROM items WHERE id_item NOT IN(SELECT id_item FROM order_details WHERE id_order = :id_order)",
        {
          replacements: { id_order },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).render("order/order-detail-create",{item, itemList, message: "Tạo mới thành công!", flag: 1 });
    }
    else{
      const item = await Order.findOne({
        where: {
          id_order,
        },
        raw: true
      })
      const itemList = await Order.sequelize.query(
        "SELECT * FROM items WHERE id_item NOT IN(SELECT id_item FROM order_details WHERE id_order = :id_order)",
        {
          replacements: { id_order },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(400).render("order/order-detail-create",{item, itemList, message: "Số lượng sản phẩm không đủ!", flag: 1});
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const updateOrderDetail = async (req, res) => {
  const {id_order, id_item} = req.params
  const {quantity} = req.body
  try {
    const check = await Order.findOne({
      where: {
        id_order
      }
    });
    if(check.status != 1){
      const staff = await Order.sequelize.query(
        "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND A.id_account = S.id_account",
        {
          replacements: { username: `${req.username}` },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      const checkQuantity = await Item_store.findOne({
        where: {
          id_item,
          id_store: staff[0].id_store
        }
      });
      if(checkQuantity.quantity >= quantity){
        await Order_detail.sequelize.query(
          "UPDATE order_details SET quantity = :quantity WHERE id_order = :id_order AND id_item = :id_item",
          {
            replacements: { id_order, id_item, quantity },
            type: QueryTypes.UPDATE,
            raw: true,
          }
        );
        const total = await Order.sequelize.query(
          "SELECT IFNULL(SUM(OD.quantity*I.price),0) AS total FROM items as I, order_details as OD WHERE OD.id_item = I.id_item AND OD.id_order = :id_order",
          {
            replacements: { id_order },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        await Order.sequelize.query(
          "UPDATE orders SET total = :total, item_fee = :total WHERE id_order = :id_order",
          {
            replacements: { id_order, total: total[0].total },
            type: QueryTypes.UPDATE,
            raw: true,
          }
        );
        const item = await Order_detail.sequelize.query(
          "SELECT * FROM order_details WHERE id_item = :id_item AND id_order = :id_order",
          {
            replacements: { id_order, id_item },
            type: QueryTypes.SELECT,
            raw: true,
          }
        );
        res.status(200).render("order/order-detail-create",{item:item[0], message: "Cập nhật thành công!", flag: 2});
      }
      else{
        res.status(400).json({ message: "Số lượng sản phẩm không đủ!" });
      }
    }
    else{
      res.status(400).json({ message: "Không thể cập nhật hoá đơn đã hoàn thành!" });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getDetailOrderDetail = async (req, res) => {
  const { id_order, id_item } = req.params;
  try {
    const item = await Order_detail.sequelize.query(
      "SELECT * FROM order_details WHERE id_order = :id_order AND id_item = :id_item",
      {
        replacements: { id_order, id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("order/order-detail-create",{ item:item[0] , flag: 2});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const deleteOrderDetail = async (req, res) => {
  const {id_order, id_item} = req.params
  try {
    const check = await Order.findOne({
      where: {
        id_order
      }
    });
    if(check.status != 1){
      await Order_detail.destroy({
        where: {
          id_order,
          id_item
        }
      });
      const total = await Order.sequelize.query(
        "SELECT IFNULL(SUM(OD.quantity*I.price),0) AS total FROM items as I, order_details as OD WHERE OD.id_item = I.id_item AND OD.id_order = :id_order",
        {
          replacements: { id_order },
          type: QueryTypes.SELECT,
          raw: true,
        } 
      );
      await Order.sequelize.query(
        "UPDATE orders SET total = :total, item_fee = :total WHERE id_order = :id_order",
        {
          replacements: { id_order, total: total[0].total },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      const item = await Order.findOne({
        where: {
          id_order,
        },
        raw: true
      })
      res.status(200).render("order/order-detail-notification",{item, message: "Xoá thành công!" });
    }
    else{
      res.status(400).json({ message: "Không thể xoá hoá đơn đã hoàn thành!" });
    }
  
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

module.exports = {
  getAllOrder,
  getAllItemInOrder,
  getAllOrderForShipper,
  confirmOrder,
  cancelOrder,
  receiveOrder,
  thongKeSanPham,
  thongKeDonHang,
  thongKeDonHangAdmin,
  thongKeSanPhamAdmin,
  createReport,
  dashboardManager,
  getAllDetailOrder,
  updateOrder,
  getAllItemInOrderToChange,
  getDetailOrderDetail,
  updateOrderDetail,
  createOrderDetailForm,
  createOrderDetail,
  deleteOrderDetail,
  getDetailOrder
};
