const { Import_invoice_detail, Import_invoice } = require("../models");
const { QueryTypes } = require("sequelize");

const createImportInvoiceDetail = async (req, res) => {
  const { quantity, id_item, unit_price, id_i_invoice } = req.body;
  try {
    await Import_invoice_detail.create({
      id_i_invoice,
      id_item,
      quantity,
      unit_price,
    });
    res.status(200).json({
      message: "Tạo mới thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItemToImport = async (req, res) => {
  const { id_i_invoice } = req.params;
  try {
    const unprocessedingredientList = await Import_invoice.sequelize.query(
      "SELECT * FROM unprocessed_ingredients WHERE id_item NOT IN(SELECT id_item FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice)",
      {
        replacements: { id_i_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({
      data: unprocessedingredientList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateImportInvoiceDetail = async (req, res) => {
  const { quantity, unit_price, id_i_invoice, id_item } = req.body;
  try {
    const check = await Import_invoice.findOne({
      where: {
        id_i_invoice,
      },
    });
    if (check.status != 1) {
      await Import_invoice_detail.sequelize.query(
        "UPDATE import_invoice_details SET quantity = :quantity, unit_price = :unit_price WHERE id_i_invoice = :id_i_invoice AND id_item = :id_item",
        {
          replacements: { id_i_invoice, id_item, quantity, unit_price },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      res.status(200).json({
        message: "Cập nhật thành công!",
      });
    } else {
      res
        .status(400)
        .json({ message: "Không thể cập nhật hoá đơn đã hoàn thành!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteImportInvoiceDetail = async (req, res) => {
  const { id_i_invoice, id_item } = req.params;
  try {
    const check = await Import_invoice.findOne({
      where: {
        id_i_invoice,
      },
    });
    if (check.status != 1) {
      await Import_invoice_detail.destroy({
        where: {
          id_i_invoice,
          id_item,
        },
      });
      res.status(200).json({
        message: "Xoá thành công!",
      });
    } else {
      res.status(400).json({ message: "Không thể xoá hoá đơn đã hoàn thành!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailImportInvoiceDetail = async (req, res) => {
  const { id_i_invoice, id_item } = req.params;
  try {
    const item = await Import_invoice_detail.sequelize.query(
      "SELECT * FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice AND id_item = :id_item",
      {
        replacements: { id_i_invoice, id_item },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).json({
      data: item[0],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createImportInvoiceDetail,
  updateImportInvoiceDetail,
  deleteImportInvoiceDetail,
  getDetailImportInvoiceDetail,
  getAllItemToImport,
};
