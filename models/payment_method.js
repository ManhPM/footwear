"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment_method extends Model {
    static associate({ Order }) {
      this.hasOne(Order, { foreignKey: "id_payment" });
    }
  }
  Payment_method.init(
    {
      id_payment: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Payment_method",
      timestamps: false,
    }
  );
  return Payment_method;
};
