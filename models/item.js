'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate({
      Cart,
      Wishlist,
      Invoice_detail,
      Review,
      Import_detail,
    }) {
      this.hasMany(Cart, { foreignKey: 'id_item' });
      this.hasMany(Invoice_detail, { foreignKey: 'id_item' });
      this.hasMany(Wishlist, { foreignKey: 'id_item' });
      this.hasMany(Review, { foreignKey: 'id_item' });
      this.hasMany(Import_detail, { foreignKey: 'id_item' });
    }
  }
  Item.init(
    {
      id_item: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      size: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      brand: DataTypes.STRING,
      origin: DataTypes.STRING,
      material: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Item',
      timestamps: false,
    },
  );
  return Item;
};
