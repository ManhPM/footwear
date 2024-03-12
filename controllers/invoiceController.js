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
            'SELECT I.* FROM invoices as I , customers as C WHERE I.id_customer = C.id_customer AND I.invoice_status = :status AND (I.datetime BETWEEN :fromdate AND :todate) ORDER BY I.datetime DESC',
            {
              replacements: { status, fromdate, todate },
              type: QueryTypes.SELECT,
              raw: true,
            },
          );
          res.status(200).json({ data: invoiceList });
        } else {
          const invoiceList = await Invoice.sequelize.query(
            'SELECT I.* FROM invoices as I , customers as C WHERE I.id_customer = C.id_customer AND I.invoice_status = :status ORDER BY I.datetime DESC',
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
            'SELECT I.* FROM invoices as I , customers as C WHERE I.id_customer = C.id_customer AND (I.datetime BETWEEN :fromdate AND :todate) ORDER BY I.datetime DESC',
            {
              replacements: { fromdate, todate },
              type: QueryTypes.SELECT,
              raw: true,
            },
          );
          res.status(200).json({ data: invoiceList });
        } else {
          const invoiceList = await Invoice.sequelize.query(
            'SELECT I.* FROM invoices as I , customers as C WHERE I.id_customer = C.id_customer ORDER BY I.datetime DESC',
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
    if (invoice.invoice_status == 0) {
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
        invoice.invoice_status = 1;
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
    });
    if (invoice.invoice_status == 2 && invoice.payment_status == 1) {
      invoice.invoice_status = 3;
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
    if (invoice.invoice_status == 0) {
      invoice.invoice_status = 3;
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
        'SELECT i.id_item, I.name, SUM(id.quantity) AS total_quantity_sold, SUM(id.quantity * i.price) AS total_price_sold FROM items i JOIN invoice_details id ON i.id_item = id.id_item JOIN invoices inv ON id.id_invoice = inv.id_invoice WHERE inv.invoice_status = 2 AND inv.datetime BETWEEN :fromdate AND :todate GROUP BY i.id_item ORDER BY total_price_sold DESC',
        {
          replacements: {
            fromdate: `${fromdate}`,
            todate: `${todate}`,
          },
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const totalImport = await Invoice_detail.sequelize.query(
        'SELECT items.id_item, items.name, SUM(import_details.quantity) as total_quantity FROM items JOIN import_details ON items.id_item = import_details.id_item JOIN imports ON import_details.id_import = imports.id_import WHERE imports.status = 1 AND imports.datetime BETWEEN :fromdate AND :todate GROUP BY items.id_item, items.name',
        {
          replacements: {
            fromdate: `${fromdate}`,
            todate: `${todate}`,
          },
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const totalExport = await Invoice_detail.sequelize.query(
        'SELECT items.id_item, items.name, SUM(export_details.quantity) as total_quantity FROM items JOIN export_details ON items.id_item = export_details.id_item JOIN exports ON export_details.id_export = exports.id_export WHERE exports.status = 1 AND exports.datetime BETWEEN :fromdate AND :todate GROUP BY items.id_item, items.name',
        {
          replacements: {
            fromdate: `${fromdate}`,
            todate: `${todate}`,
          },
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const exportCost = await Invoice_detail.sequelize.query(
        'SELECT SUM(export_details.quantity * items.price) as total_cost FROM export_details JOIN items ON export_details.id_item = items.id_item JOIN exports ON export_details.id_export = exports.id_export WHERE exports.status = 1 AND exports.datetime BETWEEN :fromdate AND :todate',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const importCost = await Invoice_detail.sequelize.query(
        'SELECT SUM(import_details.quantity * items.price) as total_cost FROM import_details JOIN items ON import_details.id_item = items.id_item JOIN imports ON import_details.id_import = imports.id_import WHERE imports.status = 1 AND imports.datetime BETWEEN :fromdate AND :todate',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const total = await Invoice_detail.sequelize.query(
        'SELECT IFNULL(SUM(I.total),0) as revenue FROM invoices as I WHERE I.invoice_status = 2 AND I.datetime BETWEEN :fromdate AND :todate',
        {
          replacements: {
            fromdate: `${fromdate}`,
            todate: `${todate}`,
          },
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({
        totalSold: totalSold,
        totalImport: totalImport,
        totalExport: totalExport,
        importCost: importCost[0].total_cost,
        exportCost: exportCost[0].total_cost,
        total: total[0].revenue,
        profit: total[0].revenue - totalImport,
      });
    } else {
      // Thống kê từ trước đến nay
      const totalSold = await Invoice_detail.sequelize.query(
        'SELECT i.id_item, I.name, SUM(id.quantity) AS total_quantity_sold, SUM(id.quantity * i.price) AS total_price_sold FROM items i JOIN invoice_details id ON i.id_item = id.id_item JOIN invoices inv ON id.id_invoice = inv.id_invoice WHERE inv.invoice_status = 2 GROUP BY i.id_item ORDER BY total_price_sold DESC',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const totalImport = await Invoice_detail.sequelize.query(
        'SELECT items.id_item, items.name, SUM(import_details.quantity) as total_quantity FROM items JOIN import_details ON items.id_item = import_details.id_item JOIN imports ON import_details.id_import = imports.id_import WHERE imports.status = 1 GROUP BY items.id_item, items.name',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const totalExport = await Invoice_detail.sequelize.query(
        'SELECT items.id_item, items.name, SUM(export_details.quantity) as total_quantity FROM items JOIN export_details ON items.id_item = export_details.id_item JOIN exports ON export_details.id_export = exports.id_export WHERE exports.status = 1 GROUP BY items.id_item, items.name',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const exportCost = await Invoice_detail.sequelize.query(
        'SELECT SUM(export_details.quantity * items.price) as total_cost FROM export_details JOIN items ON export_details.id_item = items.id_item JOIN exports ON export_details.id_export = exports.id_export WHERE exports.status = 1',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const importCost = await Invoice_detail.sequelize.query(
        'SELECT SUM(import_details.quantity * items.price) as total_cost FROM import_details JOIN items ON import_details.id_item = items.id_item JOIN imports ON import_details.id_import = imports.id_import WHERE imports.status = 1',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      const total = await Invoice_detail.sequelize.query(
        'SELECT IFNULL(SUM(I.total),0) as revenue FROM invoices as I WHERE I.invoice_status = 2',
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      res.status(200).json({
        totalSold: totalSold,
        totalImport: totalImport,
        totalExport: totalExport,
        importCost: importCost[0].total_cost,
        exportCost: exportCost[0].total_cost,
        revenue: total[0].revenue,
        profit: total[0].revenue - totalImport,
      });
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
  statistics,
};
