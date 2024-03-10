"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate({ Customer, Item }) {
      this.belongsTo(Customer, { foreignKey: "id_customer" });
      this.belongsTo(Item, { foreignKey: "id_item" });
    }
  }
  Wishlist.init(
    {
      id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_customer: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "Wishlist",
      timestamps: false,
    }
  );
  return Wishlist;
};
