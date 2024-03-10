"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Export_detail extends Model {
    static associate({ Export, Item }) {
      this.belongsTo(Export, { foreignKey: "id_export" });
      this.belongsTo(Item, { foreignKey: "id_item" });
    }
  }
  Export_detail.init(
    {
      id_export: {
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
      modelName: "Export_detail",
      timestamps: false,
    }
  );
  return Export_detail;
};
