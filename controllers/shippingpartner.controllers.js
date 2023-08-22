const { Shipping_partner, Shipper } = require("../models");
const { QueryTypes } = require("sequelize");

const getAllShippingPartner = async (req, res) => {
  try {
    const itemList = await Shipping_partner.findAll();
    res.status(201).json({itemList});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllShipper = async (req, res) => {
  const {id_shipping_partner} = req.params
  try {
    const itemList = await Shipping_partner.sequelize.query(
      "SELECT S.*, SP.name as name_shipping_partner FROM shippers AS S, shipping_partners as SP WHERE S.id_shipping_partner = :id_shipping_partner AND S.id_shipping_partner = SP.id_shipping_partner",
      {
        replacements: { id_shipping_partner },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    res.status(201).render("shipper/shipper",{itemList, id_shipping_partner, id_role: req.id_role});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const updateShipper = async (req, res) => {
  const {id_shipper} = req.params
  const {name, address, phone, description} = req.body
  try {
    const update = await Shipper.findOne({
      where: {
        id_shipper
      }
    });
    update.name = name
    update.address = address
    update.phone = phone
    description.phone = description
    await update.save();
    const item = await Shipper.findOne({
      raw: true,
      where: {
        id_shipper
      }
    });
    res.status(200).render("shipper/shipper-create",{item, message: "Cập nhật thành công!", flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getDetailShipper = async (req, res) => {
  const {id_shipper} = req.params
  try {
    const item = await Shipper.findOne({
      raw: true,
      where: {
        id_shipper
      }
    });
    res.status(200).render("shipper/shipper-create",{item, flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getAllShippingPartnerAdmin = async (req, res) => {
  try {
    const itemList = await Shipping_partner.findAll({raw: true});
    res.status(201).render("shipping-partner/shipping-partner",{itemList, id_role: req.id_role});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createShippingPartner = async (req, res) => {
  const {name, address, unit_price} = req.body
  try {
    await Shipping_partner.create({name, address, unit_price});
    res.status(201).render("shipping-partner/shipping-partner-create",{flag: 1,message: "Tạo mới thành công!"});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const updateShippingPartner = async (req, res) => {
  const {id_shipping_partner} = req.params
  const {name, address, unit_price} = req.body
  try {
    const update = await Shipping_partner.findOne({
      where: {
        id_shipping_partner
      }
    });
    update.name = name
    update.address = address
    update.unit_price = unit_price
    await update.save();
    const item = await Shipping_partner.findOne({
      raw: true,
      where: {
        id_shipping_partner
      }
    });
    res.status(200).render("shipping-partner/shipping-partner-create",{message: "Cập nhật thành công!",item,flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getDetailShippingPartner = async (req, res) => {
  const {id_shipping_partner} = req.params
  try {
    const item = await Shipping_partner.findOne({
      raw: true,
      where: {
        id_shipping_partner
      }
    });
    res.status(200).render("shipping-partner/shipping-partner-create",{item, flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const createForm = async (req, res) => {
  try {
    res.status(200).render("shipping-partner/shipping-partner-create",{flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const createFormShipper = async (req, res) => {
  const {id_shipping_partner} = req.params
  try {
    const item = await Shipping_partner.findOne({
      raw: true,
      where: {
        id_shipping_partner
      }
    });
    res.status(200).render("shipper/shipper-create",{flag: 1, item});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

module.exports = {
    getAllShippingPartner,
    createShippingPartner,
    updateShippingPartner,
    getDetailShippingPartner,
    getAllShippingPartnerAdmin,
    createForm,
    getDetailShipper,
    getAllShipper,
    updateShipper,
    createFormShipper
};
