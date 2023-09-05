const { Type } = require("../models");

const getAllType = async (req, res) => {
  try {
    const itemList = await Type.findAll({});
    res.status(200).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllType,
};
