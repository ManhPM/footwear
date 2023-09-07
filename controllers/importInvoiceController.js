const {
  Import_invoice,
  Import_invoice_detail,
  Provider,
} = require("../models");
const { QueryTypes } = require("sequelize");

const getAllImportInvoice = async (req, res) => {
  try {
    const itemList = await Import_invoice.sequelize.query(
      "SELECT II.*, P.name as name_provider FROM import_invoices AS II, providers as P, users as U WHERE P.id_provider = II.id_provider AND II.id_user = U.id_user",
      {
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItemInImportInvoice = async (req, res) => {
  const { id_i_invoice } = req.params;
  try {
    const itemList = await Import_invoice.sequelize.query(
      "SELECT I.name, IID.* FROM items AS I, import_invoice_details as IID WHERE IID.id_item = I.id_item AND IID.id_i_invoice = :id_i_invoice",
      {
        replacements: { id_i_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({
      data: itemList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteImportInvoice = async (req, res) => {
  const { id_i_invoice } = req.params;
  try {
    const itemList = await Import_invoice.sequelize.query(
      "SELECT * FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice",
      {
        replacements: { id_i_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    let i = 0;
    while (itemList[i]) {
      await Import_invoice_detail.destroy({
        where: {
          id_i_invoice: itemList[i].id_i_invoice,
          id_item: itemList[i].id_item,
        },
      });
      i++;
    }
    await Import_invoice.destroy({
      where: {
        id_i_invoice,
      },
    });
    res.status(200).json({
      message: "Xoá thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createImportInvoice = async (req, res) => {
  const { id_provider, description } = req.body;
  try {
    const check = await Import_invoice.findOne({
      where: {
        id_user: req.user.id,
        status: 0,
      },
    });
    if (!check) {
      const datetime = new Date();
      datetime.setHours(datetime.getHours() + 7);
      await Import_invoice.create({
        id_provider,
        description,
        id_user: req.user.id,
        createAt: datetime,
        status: 0,
      });
      res.status(201).json({
        message: "Tạo mới thành công!",
      });
    } else {
      res.status(400).json({
        message: "Đang có đơn chưa hoàn thành không thể tạo thêm!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeImportInvoice = async (req, res) => {
  const { id_i_invoice } = req.params;
  try {
    const itemInImportInvoiceList = await Import_invoice.sequelize.query(
      "SELECT * FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice",
      {
        replacements: { id_i_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if (itemInImportInvoiceList[0]) {
      let i = 0;
      while (itemInImportInvoiceList[i]) {
        await Import_invoice.sequelize.query(
          "UPDATE items SET quantity = quantity + :quantity WHERE id_item = :id_item",
          {
            replacements: {
              quantity: itemInImportInvoiceList[i].quantity,
              id_item: itemInImportInvoiceList[i].id_item,
            },
            type: QueryTypes.UPDATE,
            raw: true,
          }
        );
        i++;
      }
      await Import_invoice.sequelize.query(
        "UPDATE import_invoices SET status = 1 WHERE id_i_invoice = :id_i_invoice",
        {
          replacements: { id_i_invoice },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      res.status(200).json({
        message: "Đơn hàng hoàn thành!",
      });
    } else {
      await Import_invoice.sequelize.query(
        "UPDATE import_invoices SET status = 1 WHERE id_i_invoice = :id_i_invoice",
        {
          replacements: { id_i_invoice },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      res.status(200).json({
        message: "Đơn hàng hoàn thành!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateImportInvoice = async (req, res) => {
  const { id_i_invoice } = req.params;
  const { id_provider, description } = req.body;
  try {
    const check = await Import_invoice.findOne({
      where: {
        id_i_invoice,
      },
    });
    const datetime = new Date();
    datetime.setHours(datetime.getHours() + 7);
    check.id_provider = id_provider;
    check.description = description;
    check.createAt = datetime;
    await check.save();
    res.status(200).json({
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailImportInvoice = async (req, res) => {
  const { id_i_invoice } = req.params;
  try {
    const item = await Import_invoice.findOne({
      raw: true,
      where: {
        id_i_invoice,
      },
    });
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllImportInvoice,
  getDetailImportInvoice,
  getAllItemInImportInvoice,
  createImportInvoice,
  updateImportInvoice,
  deleteImportInvoice,
  completeImportInvoice,
};
