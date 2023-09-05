"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate({ User, Item }) {
      this.belongsTo(User, { foreignKey: "id_user" });
      this.belongsTo(Item, { foreignKey: "id_item" });
    }
  }
  Cart.init(
    {
      id_user: {
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
