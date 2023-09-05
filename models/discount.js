"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    static associate({ Order }) {
      this.hasMany(Order, { foreignKey: "id_discount" });
    }
  }
  Discount.init(
    {
      id_discount: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      code: DataTypes.STRING,
      discount_percent: DataTypes.INTEGER,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      min_quantity: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Discount",
      timestamps: false,
    }
  );
  return Discount;
};
