const { Invoice, Invoice_detail, Item, Item_detail } = require('../models');
const { QueryTypes } = require('sequelize');

const getAllInvoice = async (req, res) => {
  try {
    if (req.user.role == 'Khách hàng') {
      const invoiceList = await Invoice.sequelize.query(
        'SELECT I.*, II.name as name_status, P.name as name_payment_method FROM invoices as I , customers as C, invoice_statuses as II, payment_methods as P WHERE I.id_customer = C.id_customer AND I.id_customer = :id_customer AND II.id_status = I.id_status AND I.id_payment_method = P.id_payment_method ORDER BY I.datetime DESC',
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
            'SELECT I.*, II.name as name_status, P.name as name_payment_method FROM invoices as I, invoice_statuses as II, payment_methods as P, customers as C WHERE I.id_customer = C.id_customer AND I.id_status = :status AND II.id_status = I.id_status AND I.id_payment_method = P.id_payment_method AND (I.datetime BETWEEN :fromdate AND :todate) ORDER BY I.datetime DESC',
            {
              replacements: { status, fromdate, todate },
              type: QueryTypes.SELECT,
              raw: true,
            },
          );
          res.status(200).json({ data: invoiceList });
        } else {
          const invoiceList = await Invoice.sequelize.query(
            'SELECT I.*, II.name as name_status, P.name as name_payment_method FROM invoices as I, invoice_statuses as II, payment_methods as P, customers as C WHERE I.id_customer = C.id_customer AND I.id_status = :status AND II.id_status = I.id_status AND I.id_payment_method = P.id_payment_method ORDER BY I.datetime DESC',
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
            'SELECT I.*, II.name as name_status, P.name as name_payment_method FROM invoices as I, invoice_statuses as II, payment_methods as P, customers as C WHERE I.id_customer = C.id_customer AND (I.datetime BETWEEN :fromdate AND :todate) AND II.id_status = I.id_status AND I.id_payment_method = P.id_payment_method ORDER BY I.datetime DESC',
            {
              replacements: { fromdate, todate },
              type: QueryTypes.SELECT,
              raw: true,
            },
          );
          res.status(200).json({ data: invoiceList });
        } else {
          const invoiceList = await Invoice.sequelize.query(
            'SELECT I.*, II.name as name_status, P.name as name_payment_method FROM invoices as I, invoice_statuses as II, payment_methods as P, customers as C WHERE I.id_customer = C.id_customer AND II.id_status = I.id_status AND I.id_payment_method = P.id_payment_method ORDER BY I.datetime DESC',
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
    let itemList = await Invoice.sequelize.query(
      'SELECT ID.* FROM invoice_details AS ID, invoices as I WHERE I.id_invoice = ID.id_invoice AND I.id_invoice = :id_invoice',
      {
        replacements: { id_invoice: id_invoice },
        type: QueryTypes.SELECT,
      },
    );
    const invoice = await Invoice.sequelize.query(
      'SELECT C.name as name_customer, C.phone as phone_customer, II.name as name_status, P.name as name_payment_method, I.* FROM invoices as I, invoice_statuses AS II, payment_methods as P, customers as C WHERE C.id_customer = I.id_customer AND I.id_invoice = :id_invoice AND II.id_status = I.id_status AND I.id_payment_method = P.id_payment_method',
      {
        replacements: { id_invoice: id_invoice },
        type: QueryTypes.SELECT,
      },
    );
    await Promise.all(
      itemList.map(async (item) => {
        const item_detail = await Item_detail.findOne({
          where: {
            id_item_detail: item.id_item_detail,
          },
        });
        const sizes = await Item_detail.findOne({
          where: {
            id_item: item_detail.id_item,
            id_size: item_detail.id_size,
          },
        });
        const itemName = await Item.findOne({
          where: {
            id_item: item_detail.id_item,
          },
        });
        item.size = sizes.id_size;
        item.name = itemName.name;
        item.id_item = itemName.id_item;
      }),
    );
    console.log(invoice);
    res.status(200).json({
      info: invoice[0],
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCurrentInvoice = async (req, res) => {
  try {
    const item = await Invoice.findOne({
      where: {
        id_customer: req.user.id_user,
        id_status: [0, 1],
        id_payment_method: 1,
      },
    });
    res.status(200).json({
      data: item,
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
      raw: false,
    });
    if (invoice.id_status == 1) {
      const itemListInInvoice = await Invoice_detail.findAll({
        where: {
          id_invoice,
        },
      });
      let i = 0;
      let check = 1;
      while (itemListInInvoice[i]) {
        const item = await Item_detail.findOne({
          where: {
            id_item_detail: itemListInInvoice[i].id_item_detail,
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
            'UPDATE item_details SET quantity = quantity - (:quantity) WHERE id_item_detail = :id_item_detail',
            {
              replacements: {
                id_item_detail: itemListInInvoice[j].id_item_detail,
                quantity: itemListInInvoice[j].quantity,
              },
              type: QueryTypes.UPDATE,
              raw: true,
            },
          );
          j++;
        }
        invoice.id_status = 2;
        await invoice.save();
        res.status(201).json({
          message: 'Xác nhận đơn hàng!',
        });
      } else {
        res.status(400).json({
          message: 'Số lượng sản phẩm không đủ. Không thể nhận đơn!',
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
      raw: false,
    });
    if (invoice.id_status == 2 && invoice.payment_status == 1) {
      invoice.id_status = 4;
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
      raw: false,
    });
    if (invoice.id_status == 1) {
      invoice.id_status = 3;
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

const statistics = async (req, res) => {
  const { fromdate, todate } = req.query;
  try {
    if (fromdate !== undefined && todate !== undefined) {
      // Thống kê từ ngày fromdate đến ngày todate
      const totalSold = await Invoice_detail.sequelize.query(
        'SELECT i.id_item, i.name, SUM(id.quantity) AS total_quantity_sold, SUM(id.quantity * id.unit_price) AS total_price_sold FROM items i JOIN invoice_details id ON i.id_item = id.id_item_detail JOIN invoices inv ON id.id_invoice = inv.id_invoice WHERE inv.id_status = 2 AND inv.datetime BETWEEN ? AND ? GROUP BY i.id_item ORDER BY total_price_sold DESC',
        {
          replacements: [fromdate, todate],
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const totalImport = await Invoice_detail.sequelize.query(
        'SELECT items.id_item, items.name, SUM(import_details.quantity) as total_quantity FROM items JOIN import_details ON items.id_item = import_details.id_item_detail JOIN imports ON import_details.id_import = imports.id_import WHERE imports.status = 1 AND imports.datetime BETWEEN ? AND ? GROUP BY items.id_item, items.name',

        {
          replacements: [fromdate, todate],
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const importCost = await Invoice_detail.sequelize.query(
        'SELECT SUM(import_details.quantity * import_details.unit_price) as total_cost FROM import_details JOIN items ON import_details.id_item_detail = items.id_item JOIN imports ON import_details.id_import = imports.id_import WHERE imports.status = 1 AND imports.datetime BETWEEN ? AND ?',
        {
          replacements: [fromdate, todate],
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const total = await Invoice_detail.sequelize.query(
        'SELECT IFNULL(SUM(I.total),0) as revenue FROM invoices as I WHERE I.id_status = 2 AND I.datetime BETWEEN ? AND ?',
        {
          replacements: [fromdate, todate],
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({
        totalSold: totalSold,
        totalImport: totalImport,
        importCost: importCost[0].total_cost,
        revenue: total[0].revenue,
        profit:
          total[0].revenue - importCost[0].total_cost > 0
            ? total[0].revenue - importCost[0].total_cost
            : 0,
      });
    } else {
      // Thống kê từ trước đến nay
      const totalSold = await Invoice_detail.sequelize.query(
        'SELECT i.id_item, i.name, SUM(id.quantity) AS total_quantity_sold, SUM(id.quantity * id.unit_price) AS total_price_sold FROM items i JOIN invoice_details id ON i.id_item = id.id_item_detail JOIN invoices inv ON id.id_invoice = inv.id_invoice WHERE inv.id_status = 2 GROUP BY i.id_item ORDER BY total_price_sold DESC',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const totalImport = await Invoice_detail.sequelize.query(
        'SELECT items.id_item, items.name, SUM(import_details.quantity) as total_quantity FROM items JOIN import_details ON items.id_item = import_details.id_item_detail JOIN imports ON import_details.id_import = imports.id_import WHERE imports.status = 1 GROUP BY items.id_item, items.name',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const importCost = await Invoice_detail.sequelize.query(
        'SELECT SUM(import_details.quantity * import_details.unit_price) as total_cost FROM import_details JOIN items ON import_details.id_item_detail = items.id_item JOIN imports ON import_details.id_import = imports.id_import WHERE imports.status = 1 ',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const total = await Invoice_detail.sequelize.query(
        'SELECT IFNULL(SUM(I.total),0) as revenue FROM invoices as I WHERE I.id_status = 2',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({
        totalSold: totalSold,
        totalImport: totalImport,
        importCost: importCost[0].total_cost,
        revenue: total[0].revenue,
        profit:
          total[0].revenue - importCost[0].total_cost > 0
            ? total[0].revenue - importCost[0].total_cost
            : 0,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCurrentInvoice,
  getAllInvoice,
  getAllItemInInvoice,
  confirmInvoice,
  cancelInvoice,
  completeInvoice,
  statistics,
};
