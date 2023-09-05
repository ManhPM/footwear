"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Import_invoice_detail extends Model {
    static associate({ Import_invoice, Item }) {
      this.belongsTo(Import_invoice, { foreignKey: "id_i_invoice" });
      this.belongsTo(Item, { foreignKey: "id_item" });
    }
  }
  Import_invoice_detail.init(
    {
      id_i_invoice: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      quantity: DataTypes.INTEGER,
      unit_price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Import_invoice_detail",
      timestamps: false,
    }
  );
  return Import_invoice_detail;
};
