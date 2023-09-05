const { Provider } = require("../models");

const getAllProvider = async (req, res) => {
  try {
    const itemList = await Provider.findAll({});
    res.status(201).json({ data: itemList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProvider,
};
