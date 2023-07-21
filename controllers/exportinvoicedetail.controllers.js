const { Export_invoice_detail, Export_invoice, Unprocessed_ingredient } = require("../models");
const { QueryTypes } = require("sequelize");

const createExportInvoiceDetail = async (req, res) => {
  const {id_e_invoice} = req.params
  const {quantity, id_u_ingredient, unit_price} = req.body
  try {
    await Export_invoice_detail.create({id_e_invoice, id_u_ingredient, quantity, unit_price})
    const item = await Export_invoice.findOne({
      where: {
        id_e_invoice,
      },
      raw: true
    })
    const unprocessedingredientList = await Export_invoice.sequelize.query(
      "SELECT * FROM unprocessed_ingredients WHERE id_u_ingredient NOT IN(SELECT id_u_ingredient FROM export_invoice_details WHERE id_e_invoice = :id_e_invoice)",
      {
        replacements: { id_e_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("export-invoice/export-invoice-detail-create",{item, unprocessedingredientList, message: "Tạo mới thành công!", flag: 1 });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const updateExportInvoiceDetail = async (req, res) => {
  const {id_e_invoice, id_u_ingredient} = req.params
  const {quantity} = req.body
  try {
    const check = await Export_invoice.findOne({
      where: {
        id_e_invoice
      }
    });
    if(check.status != 1){
      await Export_invoice_detail.sequelize.query(
        "UPDATE export_invoice_details SET quantity = :quantity WHERE id_e_invoice = :id_e_invoice AND id_u_ingredient = :id_u_ingredient",
        {
          replacements: { id_e_invoice, id_u_ingredient, quantity },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      const item = await Export_invoice_detail.sequelize.query(
        "SELECT * FROM export_invoice_details WHERE id_u_ingredient = :id_u_ingredient AND id_e_invoice = :id_e_invoice",
        {
          replacements: { id_e_invoice, id_u_ingredient },
          type: QueryTypes.SELECT,
          raw: true,
        }
      );
      res.status(200).render("export-invoice/export-invoice-detail-create",{item:item[0], message: "Cập nhật thành công!", flag: 2});
    }
    else{
      res.status(400).json({ message: "Không thể cập nhật hoá đơn đã hoàn thành!" });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const deleteExportInvoiceDetail = async (req, res) => {
  const {id_e_invoice, id_u_ingredient} = req.params
  try {
    const check = await Export_invoice.findOne({
      where: {
        id_e_invoice
      }
    });
    if(check.status != 1){
      await Export_invoice_detail.destroy({
        where: {
          id_e_invoice,
          id_u_ingredient
        }
      });
      const item = await Export_invoice.findOne({
        where: {
          id_e_invoice,
        },
        raw: true
      })
      res.status(200).render("export-invoice/export-invoice-detail-notification",{item, message: "Xoá thành công!" });
    }
    else{
      res.status(400).json({ message: "Không thể xoá hoá đơn đã hoàn thành!" });
    }
  
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};
const getDetailExportInvoiceDetail = async (req, res) => {
  const { id_e_invoice, id_u_ingredient } = req.params;
  try {
    const item = await Export_invoice_detail.sequelize.query(
      "SELECT * FROM export_invoice_details WHERE id_e_invoice = :id_e_invoice AND id_u_ingredient = :id_u_ingredient",
      {
        replacements: { id_e_invoice, id_u_ingredient },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(200).render("export-invoice/export-invoice-detail-create",{ item:item[0] , flag: 2});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createForm = async (req, res) => {
  const {id_e_invoice} = req.params
  try {
    const unprocessedingredientList = await Export_invoice.sequelize.query(
      "SELECT * FROM unprocessed_ingredients WHERE id_u_ingredient NOT IN(SELECT id_u_ingredient FROM export_invoice_details WHERE id_e_invoice = :id_e_invoice)",
      {
        replacements: { id_e_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const item = await Export_invoice.findOne({
      where: {
        id_e_invoice,
      },
      raw: true
    })
    res.status(200).render("export-invoice/export-invoice-detail-create",{item, unprocessedingredientList, flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

module.exports = {
  createExportInvoiceDetail,
  updateExportInvoiceDetail,
  deleteExportInvoiceDetail,
  getDetailExportInvoiceDetail,
  createForm
};
