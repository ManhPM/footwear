const { Invoice, Invoice_detail, Item } = require('../models');
const { QueryTypes } = require('sequelize');

const getAllInvoice = async (req, res) => {
  try {
    if (req.user.role == 'Khách hàng') {
      const invoiceList = await Invoice.sequelize.query(
        'SELECT I.* FROM invoices as I , customers as C WHERE I.id_customer = C.id_customer = :id_customer ORDER BY I.datetime DESC',
        {
          replacements: { id_customer: req.user.id_user },
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({ data: invoiceList });
    } else {
      const { status, fromdate, todate } = req.query;
      if (status) {
        if (fromdate && todate) {
          const invoiceList = await Invoice.sequelize.query(
            'SELECT I.* FROM invoices as I , customers as C WHERE I.id_customer = C.id_customer = :id_customer AND I.status = :status AND (I.datetime BETWEEN :fromdate AND :todate) ORDER BY I.datetime DESC',
            {
              replacements: { status, fromdate, todate },
              type: QueryTypes.SELECT,
              raw: true,
            },
          );
          res.status(200).json({ data: invoiceList });
        } else {
          const invoiceList = await Invoice.sequelize.query(
            'SELECT I.* FROM invoices as I , customers as C WHERE I.id_customer = C.id_customer = :id_customer AND I.status = :status ORDER BY I.datetime DESC',
            {
              replacements: { status: status },
              type: QueryTypes.SELECT,
              raw: true,
            },
          );
          res.status(200).json({ data: invoiceList });
        }
      } else {
        if (fromdate && todate) {
          const invoiceList = await Invoice.sequelize.query(
            'SELECT I.* FROM invoices as I , customers as C WHERE I.id_customer = C.id_customer = :id_customer AND (I.datetime BETWEEN :fromdate AND :todate) ORDER BY I.datetime DESC',
            {
              replacements: { fromdate, todate },
              type: QueryTypes.SELECT,
              raw: true,
            },
          );
          res.status(200).json({ data: invoiceList });
        } else {
          const invoiceList = await Invoice.sequelize.query(
            'SELECT I.* FROM invoices as I , customers as C WHERE I.id_customer = C.id_customer = :id_customer ORDER BY I.datetime DESC',
            {
              type: QueryTypes.SELECT,
              raw: true,
            },
          );
          res.status(200).json({ data: invoiceList });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItemInInvoice = async (req, res) => {
  const { id_invoice } = req.params;
  try {
    const itemList = await Invoice.sequelize.query(
      'SELECT ID.quantity as invoice_quantity, I.* FROM invoice_details as ID, items as I WHERE I.id_item = ID.id_item AND ID.id_invoice = :id_invoice',
      {
        replacements: { id_invoice: id_invoice },
        type: QueryTypes.SELECT,
      },
    );
    const invoice = await Invoice.sequelize.query(
      'SELECT C.name as name_customer, C.phone as phone_customer, S.name as name_staff, I.* FROM invoices as I, staffs as S, customers as C WHERE C.id_customer = I.id_customer AND I.id_staff = S.id_staff AND I.id_invoice = :id_invoice',
      {
        replacements: { id_invoice: id_invoice },
        type: QueryTypes.SELECT,
      },
    );
    res.status(200).json({
      info: invoice[0],
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmInvoice = async (req, res) => {
  const { id_invoice } = req.params;
  try {
    const invoice = await Invoice.findOne({
      where: {
        id_invoice,
      },
    });
    if (invoice.status == 0) {
      const itemListInInvoice = await Invoice_detail.findAll({
        where: {
          id_invoice,
        },
      });
      let i = 0;
      let check = 1;
      while (itemListInInvoice[i]) {
        const item = await Item.findOne({
          where: {
            id_item: itemListInInvoice[i].id_item,
          },
        });
        if (item.quantity >= itemListInInvoice[i].quantity) {
          i++;
        } else {
          check = 0;
          break;
        }
      }
      if (check) {
        let j = 0;
        while (itemListInInvoice[j]) {
          await Invoice.sequelize.query(
            'UPDATE items SET quantity = quantity - (:quantity) WHERE id_item = :id_item',
            {
              replacements: {
                id_item: itemListInInvoice[j].id_item,
                quantity: itemListInInvoice[j].quantity,
              },
              type: QueryTypes.UPDATE,
              raw: true,
            },
          );
          j++;
        }
        invoice.status = 1;
        await invoice.save();
        res.status(201).json({
          message: 'Xác nhận đơn hàng!',
        });
      } else {
        res.status(400).json({
          message: 'Số lượng sản phẩm không đủ. Không thể hoàn thành!',
        });
      }
    } else {
      res.status(400).json({
        message: 'Thao tác thất bại. Đơn hàng đã được xác nhận!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeInvoice = async (req, res) => {
  const { id_invoice } = req.params;
  try {
    const invoice = await Invoice.findOne({
      where: {
        id_invoice,
      },
    });
    if (invoice.status == 2 && invoice.payment_status == 1) {
      invoice.status = 3;
      await invoice.save();
      res.status(200).json({
        message: 'Đơn hàng hoàn thành!',
      });
    } else {
      res.status(400).json({
        message:
          'Thao tác thất bại. Đơn hàng chưa được xác nhận hoặc thanh toán!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelInvoice = async (req, res) => {
  const { id_invoice } = req.params;
  try {
    const invoice = await Invoice.findOne({
      where: {
        id_invoice,
      },
    });
    if (invoice.status == 0) {
      invoice.status = 3;
      await invoice.save();
      res.status(200).json({
        message: 'Đơn hàng đã được huỷ bỏ!',
      });
    } else {
      res.status(400).json({
        message: 'Thao tác thất bại. Đơn hàng đã được xác nhận hoặc đã huỷ!',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const thongKeSanPham = async (req, res) => {
  const { tuNgay, denNgay } = req.query;
  try {
    if (tuNgay !== undefined && denNgay !== undefined) {
      // Thống kê từ ngày tuNgay đến ngày denNgay
      const thongKe = await Invoice_detail.sequelize.query(
        'SELECT I.image, I.id_item, I.numberOfVolumes, I.name, I.price, (SELECT IFNULL(SUM(order_details.quantity),0) FROM order_details WHERE id_item = I.id_item) as sold, (SELECT IFNULL(SUM(order_details.quantity*I.price),0) FROM order_details WHERE id_item = I.id_item) as total FROM items as I, order_details as OD, orders as O WHERE I.status = 4 AND I.id_invoice = OD.id_invoice AND OD.id_item = I.id_item AND I.time_order BETWEEN :tuNgay AND :denNgay GROUP BY I.id_item ORDER BY total DESC',
        {
          replacements: {
            tuNgay: `${tuNgay}`,
            denNgay: `${denNgay}`,
          },
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const total = await Invoice_detail.sequelize.query(
        'SELECT SUM(OD.quantity*I.price) as total FROM items as I, order_details as OD, orders as O WHERE I.status = 4 AND I.id_invoice = OD.id_invoice AND OD.id_item = I.id_item AND I.time_order BETWEEN :tuNgay AND :denNgay',
        {
          replacements: {
            tuNgay: `${tuNgay}`,
            denNgay: `${denNgay}`,
          },
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({ data: thongKe, total: total[0].total });
    } else {
      // Thống kê từ trước đến nay
      const thongKe = await Invoice_detail.sequelize.query(
        'SELECT I.image, I.id_item, I.numberOfVolumes, I.name, I.price, (SELECT IFNULL(SUM(order_details.quantity),0) FROM order_details WHERE id_item = I.id_item) as sold, (SELECT IFNULL(SUM(order_details.quantity*I.price),0) FROM order_details WHERE id_item = I.id_item) as total FROM items as I, order_details as OD, orders as O WHERE I.status = 4 AND I.id_invoice = OD.id_invoice AND OD.id_item = I.id_item GROUP BY I.id_item ORDER BY total DESC',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const total = await Invoice_detail.sequelize.query(
        'SELECT SUM(OD.quantity*I.price) as total FROM items as I, order_details as OD, orders as O WHERE I.status = 4 AND I.id_invoice = OD.id_invoice AND OD.id_item = I.id_item',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({ data: thongKe, total: total[0].total });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllInvoice,
  getAllItemInInvoice,
  confirmInvoice,
  cancelInvoice,
  completeInvoice,
  thongKeSanPham,
};
