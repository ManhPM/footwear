'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate({ Wishlist, Item_detail, Type }) {
      this.hasMany(Wishlist, { foreignKey: 'id_item' });
      this.hasMany(Item_detail, { foreignKey: 'id_item' });
      this.belongsTo(Type, { foreignKey: 'id_type' });
    }
  }
  Item.init(
    {
      id_item: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING,
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
