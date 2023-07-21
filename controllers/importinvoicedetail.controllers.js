const { Import_invoice_detail, Import_invoice } = require("../models");
const { QueryTypes } = require("sequelize");

const createImportInvoiceDetail = async (req, res) => {
  const { id_i_invoice } = req.params
  const { quantity, id_u_ingredient, unit_price } = req.body;
  try {
    await Import_invoice_detail.create({
      id_i_invoice,
      id_u_ingredient,
      quantity,
      unit_price
    });
    const item = await Import_invoice.findOne({
      where: {
        id_i_invoice,
      },
      raw: true
    })
    const unprocessedingredientList = await Import_invoice.sequelize.query(
      "SELECT * FROM unprocessed_ingredients WHERE id_u_ingredient NOT IN(SELECT id_u_ingredient FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice)",
      {
        replacements: { id_i_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("import-invoice/import-invoice-detail-create",{item, unprocessedingredientList, message: "Tạo mới thành công!", flag: 1 });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const updateImportInvoiceDetail = async (req, res) => {
  const { id_i_invoice, id_u_ingredient } = req.params;
  const { quantity, unit_price } = req.body;
  try {
    const check = await Import_invoice.findOne({
      where: {
        id_i_invoice,
      },
    });
    if (check.status != 1) {
      await Import_invoice_detail.sequelize.query(
        "UPDATE import_invoice_details SET quantity = :quantity, unit_price = :unit_price WHERE id_i_invoice = :id_i_invoice AND id_u_ingredient = :id_u_ingredient",
        {
          replacements: { id_i_invoice, id_u_ingredient, quantity, unit_price },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      const item = await Import_invoice_detail.sequelize.query(
        "SELECT * FROM import_invoice_details WHERE id_u_ingredient = :id_u_ingredient AND id_i_invoice = :id_i_invoice",
        {
          replacements: { id_i_invoice, id_u_ingredient },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).render("import-invoice/import-invoice-detail-create",{item:item[0], message: "Cập nhật thành công!", flag: 2 });
    } else {
      res
        .status(400)
        .json({ message: "Không thể cập nhật hoá đơn đã hoàn thành!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const deleteImportInvoiceDetail = async (req, res) => {
  const { id_i_invoice, id_u_ingredient } = req.params;
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
          id_u_ingredient,
        },
      });
      const item = await Import_invoice.findOne({
        where: {
          id_i_invoice,
        },
        raw: true
      })
      res.status(200).render("import-invoice/import-invoice-detail-notification",{item, message: "Xoá thành công!" });
    } else {
      res.status(400).json({ message: "Không thể xoá hoá đơn đã hoàn thành!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getDetailImportInvoiceDetail = async (req, res) => {
  const { id_i_invoice, id_u_ingredient } = req.params;
  try {
    const item = await Import_invoice_detail.sequelize.query(
      "SELECT * FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice AND id_u_ingredient = :id_u_ingredient",
      {
        replacements: { id_i_invoice, id_u_ingredient },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("import-invoice/import-invoice-detail-create",{ item:item[0] , flag: 2});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createForm = async (req, res) => {
  const {id_i_invoice} = req.params
  try {
    const unprocessedingredientList = await Import_invoice.sequelize.query(
      "SELECT * FROM unprocessed_ingredients WHERE id_u_ingredient NOT IN(SELECT id_u_ingredient FROM import_invoice_details WHERE id_i_invoice = :id_i_invoice)",
      {
        replacements: { id_i_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const item = await Import_invoice.findOne({
      where: {
        id_i_invoice,
      },
      raw: true
    })
    res.status(200).render("import-invoice/import-invoice-detail-create",{unprocessedingredientList, flag: 1, item});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

module.exports = {
    createImportInvoiceDetail,
    updateImportInvoiceDetail,
    deleteImportInvoiceDetail,
    getDetailImportInvoiceDetail,
    createForm
};
