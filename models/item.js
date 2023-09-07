"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate({ Cart, Wishlist, Order_detail, Type }) {
      this.hasMany(Cart, { foreignKey: "id_item" });
      this.hasMany(Order_detail, { foreignKey: "id_item" });
      this.hasMany(Wishlist, { foreignKey: "id_item" });
      this.belongsTo(Type, { foreignKey: "id_type" });
    }
  }
  Item.init(
    {
      id_item: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      numberOfVolumes: DataTypes.INTEGER,
      authorName: DataTypes.STRING,
      language: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      publicDate: DataTypes.DATE,
      publicComName: DataTypes.STRING,
      image: DataTypes.STRING,
      price: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Item",
      timestamps: false,
    }
  );
  return Item;
};
