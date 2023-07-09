const { Shipping_partner } = require("../models");

const getAllShippingPartner = async (req, res) => {
  try {
    const itemList = await Shipping_partner.findAll({raw: true});
    res.status(201).json("shipping-partner/shipping-partner",{itemList});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getAllShippingPartnerAdmin = async (req, res) => {
  try {
    const itemList = await Shipping_partner.findAll({raw: true});
    res.status(201).render("shipping-partner/shipping-partner",{itemList});
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

module.exports = {
    getAllShippingPartner,
    createShippingPartner,
    updateShippingPartner,
    getDetailShippingPartner,
    getAllShippingPartnerAdmin,
    createForm
};
