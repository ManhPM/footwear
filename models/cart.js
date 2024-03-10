"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate({ Customer, Item }) {
      this.belongsTo(Customer, { foreignKey: "id_customer" });
      this.belongsTo(Item, { foreignKey: "id_item" });
    }
  }
  Cart.init(
    {
      id_customer: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
      timestamps: false,
    }
  );
  return Cart;
};
