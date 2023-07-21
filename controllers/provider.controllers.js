const { Provider } = require("../models");

const getAllProvider = async (req, res) => {
  try {
    const itemList = await Provider.findAll({raw: true});
    res.status(201).render("provider/provider",{itemList, id_role: req.id_role});
  } catch (error) {
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const createProvider = async (req, res) => {
  const {name, phone, address} = req.body
  try {
    await Provider.create({name, phone, address});
    res.status(201).render("provider/provider-create",{message: "Tạo mới thành công!", flag: 1})
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const updateProvider = async (req, res) => {
  const {id_provider} = req.params
  const {name, phone, address} = req.body
  try {
    const update = await Provider.findOne({
      where: {
        id_provider
      }
    });
    update.name = name
    update.phone = phone
    update.address = address
    await update.save();
    const item = await Provider.findOne({
      raw: true,
      where: {
        id_provider
      }
    });
    res.status(201).render("provider/provider-create",{item,message: "Cập nhật thành công!",flag: 2})
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const getDetailProvider = async (req, res) => {
  const {id_provider} = req.params
  try {
    const item = await Provider.findOne({
      raw: true,
      where: {
        id_provider
      }
    });
    res.status(200).render("provider/provider-create",{item, flag: 2});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

const createForm = async (req, res) => {
  try {
    res.status(200).render("provider/provider-create",{flag: 1});
  } catch (error) {
    res.status(500).json({message: "Đã có lỗi xảy ra!"});
  }
};

module.exports = {
    getAllProvider,
    getDetailProvider,
    createProvider,
    updateProvider,
    createForm
};
