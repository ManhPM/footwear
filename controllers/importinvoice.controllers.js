const {
  Import_invoice,
  Import_invoice_detail,
  Provider,
} = require("../models");
const { QueryTypes } = require("sequelize");

const getAllImportInvoice = async (req, res) => {
  const {flag} = req.params
  try {
    const staff = await Import_invoice.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND S.id_account = A.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const itemList = await Import_invoice.sequelize.query(
      "SELECT II.id_i_invoice, II.status, II.description, DATE_FORMAT(II.datetime, '%d/%m/%Y %H:%i') as datetime, SA.name as name_staff, P.name as name_provider FROM import_invoices AS II, staffs as SA, providers as P WHERE SA.id_staff = II.id_staff AND II.id_provider = P.id_provider AND II.id_staff = :id_staff",
      {
        replacements: { id_staff: staff[0].id_staff },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    if(flag){
      res.status(200).render("import-invoice/import-invoice-print", { itemList, id_role: req.id_role });
    }
    else{
      res.status(200).render("import-invoice/import-invoice", { itemList, id_role: req.id_role });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllItemInImportInvoice = async (req, res) => {
  const { id_i_invoice } = req.params;
  try {
    const itemList = await Import_invoice.sequelize.query(
      "SELECT IID.*, II.status, UI.name as name_u_ingredient, UI.image FROM import_invoice_details as IID, import_invoices as II, unprocessed_ingredients as UI WHERE IID.id_i_invoice = II.id_i_invoice AND UI.id_u_ingredient = IID.id_u_ingredient AND II.id_i_invoice = :id_i_invoice",
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
      raw: true,
    });
    if (item.status) {
      res.status(200).render("import-invoice/import-invoice-detail-print", {
        item,
        itemList,
        flag: 0, id_role: req.id_role
      });
    } else {
      res.status(200).render("import-invoice/import-invoice-detail", {
        item,
        itemList,
        flag: 1, id_role: req.id_role
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
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
          id_u_ingredient: itemList[i].id_u_ingredient,
        },
      });
      i++;
    }
    await Import_invoice.destroy({
      where: {
        id_i_invoice,
      },
    });
    res.status(200).render("import-invoice/import-invoice-notification", {
      message: "Xoá thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createImportInvoice = async (req, res) => {
  const { id_provider, description } = req.body;
  try {
    const staff = await Import_invoice.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND S.id_account = A.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const check = await Import_invoice.findOne({
      where: {
        id_staff: staff[0].id_staff,
        status: 0,
      },
    });
    const providerList = await Provider.findAll({ raw: true });
    if (!check) {
      const datetime = new Date();
      datetime.setHours(datetime.getHours() + 7);
      await Import_invoice.create({
        id_provider,
        description,
        id_staff: staff[0].id_staff,
        datetime,
        status: 0,
      });
      res.status(201).render("import-invoice/import-invoice-create", {
        message: "Tạo mới thành công!",
        flag: 1,
        providerList,
      });
    } else {
      res.status(400).render("import-invoice/import-invoice-create", {
        message: "Đang có đơn chưa hoàn thành không thể tạo thêm!",
        flag: 1,
        providerList,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const completeImportInvoice = async (req, res) => {
  const { id_i_invoice } = req.params;
  try {
    const staff = await Import_invoice.sequelize.query(
      "SELECT S.* FROM staffs as S, accounts as A WHERE A.username = :username AND S.id_account = A.id_account",
      {
        replacements: { username: `${req.username}` },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
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
          "UPDATE unprocessed_ingredient_stores SET quantity = quantity + :quantity WHERE id_u_ingredient = :id_u_ingredient AND id_store = :id_store",
          {
            replacements: {
              quantity: itemInImportInvoiceList[i].quantity,
              id_u_ingredient: itemInImportInvoiceList[i].id_u_ingredient,
              id_store: staff[0].id_store,
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
      res.status(200).render("import-invoice/import-invoice-notification", {
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
      res.status(200).render("import-invoice/import-invoice-notification", {
        message: "Đơn hàng hoàn thành!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
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
    check.datetime = datetime;
    await check.save();
    const item = await Import_invoice.findOne({
      where: {
        id_i_invoice,
      },
      raw: true,
    });
    res.status(200).render("import-invoice/import-invoice-create", {
      message: "Cập nhật thành công!",
      flag: 2,
      item,
    });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
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
    res
      .status(200)
      .render("import-invoice/import-invoice-create", { item, flag: 2 });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createForm = async (req, res) => {
  try {
    const providerList = await Provider.findAll({ raw: true });
    res.status(200).render("import-invoice/import-invoice-create", {
      providerList,
      flag: 1,
    });
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

module.exports = {
  getAllImportInvoice,
  getDetailImportInvoice,
  getAllItemInImportInvoice,
  createImportInvoice,
  updateImportInvoice,
  createForm,
  deleteImportInvoice,
  completeImportInvoice
};
