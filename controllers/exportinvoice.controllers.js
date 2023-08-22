const { Export_invoice, Export_invoice_detail } = require("../models");
const { QueryTypes } = require("sequelize");

const getAllExportInvoice = async (req, res) => {
  const {flag} = req.params
  try {
    const staff = await Export_invoice.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND S.id_account = A.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const exportInvoiceList = await Export_invoice.sequelize.query(
      "SELECT EI.id_e_invoice, EI.status, EI.description, DATE_FORMAT(EI.datetime, '%d/%m/%Y %H:%i') as datetime, SA.name as name_staff FROM export_invoices AS EI, staffs as SA WHERE SA.id_staff = EI.id_staff  AND EI.id_staff = :id_staff",
      {
        replacements: { id_staff: staff[0].id_staff },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if(flag){
      res
      .status(200)
      .render("export-invoice/export-invoice-print", { exportInvoiceList, id_role: req.id_role });
    }
    else{
      res
      .status(200)
      .render("export-invoice/export-invoice", { exportInvoiceList, id_role: req.id_role });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllItemInExportInvoice = async (req, res) => {
  const { id_e_invoice } = req.params;
  try {
    const itemList = await Export_invoice.sequelize.query(
      "SELECT EID.*, EI.status, UI.name as name_u_ingredient, UI.image FROM export_invoice_details as EID, export_invoices as EI, unprocessed_ingredients as UI WHERE EID.id_e_invoice = EI.id_e_invoice AND UI.id_u_ingredient = EID.id_u_ingredient AND EI.id_e_invoice = :id_e_invoice",
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
      raw: true,
    });
    if (item.status) {
      res.status(200).render("export-invoice/export-invoice-detail-print", {
        item,
        itemList,
        flag: 0, id_role: req.id_role
      });
    } else {
      res.status(200).render("export-invoice/export-invoice-detail", {
        item,
        itemList,
        flag: 1, id_role: req.id_role
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createExportInvoice = async (req, res) => {
  const { description } = req.body;
  try {
    const staff = await Export_invoice.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND S.id_account = A.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const check = await Export_invoice.findOne({
      where: {
        id_staff: staff[0].id_staff,
        status: 0,
      },
    });
    if (!check) {
      const datetime = new Date();
      datetime.setHours(datetime.getHours() + 7);
      await Export_invoice.create({
        description,
        id_staff: staff[0].id_staff,
        datetime,
        status: 0,
      });
      res.status(201).render("export-invoice/export-invoice-create", {
        message: "Tạo mới thành công!",
        flag: 1,
      });
    } else {
      res.status(400).render("export-invoice/export-invoice-create", {
        message: "Đang có đơn chưa hoàn thành không thể tạo thêm!",
        flag: 1,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const updateExportInvoice = async (req, res) => {
  const { id_e_invoice } = req.params;
  const { description } = req.body;
  try {
    const check = await Export_invoice.findOne({
      where: {
        id_e_invoice,
      },
    });
    const datetime = new Date();
    datetime.setHours(datetime.getHours() + 7);
    check.description = description;
    check.datetime = datetime;
    await check.save();
    const item = await Export_invoice.findOne({
      where: {
        id_e_invoice,
      },
      raw: true,
    });
    res.status(200).render("export-invoice/export-invoice-create", {
      message: "Cập nhật thành công!",
      item,
      flag: 2,
    });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const completeExportInvoice = async (req, res) => {
  const { id_e_invoice } = req.params;
  try {
    const staff = await Export_invoice.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND S.id_account = A.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const itemInExportInvoiceList = await Export_invoice.sequelize.query(
      "SELECT * FROM export_invoice_details WHERE id_e_invoice = :id_e_invoice",
      {
        replacements: { id_e_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if (itemInExportInvoiceList[0]) {
      let i = 0;
      while (itemInExportInvoiceList[i]) {
        await Export_invoice.sequelize.query(
          "UPDATE unprocessed_ingredient_stores SET quantity = quantity - :quantity WHERE id_u_ingredient = :id_u_ingredient AND id_store = :id_store",
          {
            replacements: {
              quantity: itemInExportInvoiceList[i].quantity,
              id_u_ingredient: itemInExportInvoiceList[i].id_u_ingredient,
              id_store: staff[0].id_store,
            },
            type: QueryTypes.UPDATE,
            raw: true,
          }
        );
        i++;
      }
      await Export_invoice.sequelize.query(
        "UPDATE export_invoices SET status = 1 WHERE id_e_invoice = :id_e_invoice",
        {
          replacements: { id_e_invoice },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      res.status(200).render("export-invoice/export-invoice-notification", {
        message: "Đơn xuất hoàn thành!",
      });
    } else {
      await Export_invoice.sequelize.query(
        "UPDATE export_invoices SET status = 1 WHERE id_e_invoice = :id_e_invoice",
        {
          replacements: { id_e_invoice },
          type: QueryTypes.UPDATE,
          raw: true,
        }
      );
      res.status(200).render("export-invoice/export-invoice-notification", {
        message: "Đơn xuất hoàn thành!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getDetailExportInvoice = async (req, res) => {
  const { id_e_invoice } = req.params;
  try {
    const item = await Export_invoice.findOne({
      raw: true,
      where: {
        id_e_invoice,
      },
    });
    res
      .status(200)
      .render("export-invoice/export-invoice-create", { item, flag: 2 });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createForm = async (req, res) => {
  try {
    res.status(200).render("export-invoice/export-invoice-create", { flag: 1 });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const deleteExportInvoice = async (req, res) => {
  const { id_e_invoice } = req.params;
  try {
    const itemList = await Export_invoice.sequelize.query(
      "SELECT * FROM export_invoice_details WHERE id_e_invoice = :id_e_invoice",
      {
        replacements: { id_e_invoice },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    let i = 0;
    while (itemList[i]) {
      await Export_invoice_detail.destroy({
        where: {
          id_e_invoice: itemList[i].id_e_invoice,
          id_u_ingredient: itemList[i].id_u_ingredient,
        },
      });
      i++;
    }
    await Export_invoice.destroy({
      where: {
        id_e_invoice,
      },
    });
    res.status(200).render("export-invoice/export-invoice-notification", {
      message: "Xoá thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

module.exports = {
  getAllExportInvoice,
  getDetailExportInvoice,
  getAllItemInExportInvoice,
  updateExportInvoice,
  createExportInvoice,
  createForm,
  deleteExportInvoice,
  completeExportInvoice
};
