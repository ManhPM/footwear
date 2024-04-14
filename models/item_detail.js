'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item_detail extends Model {
    static associate({ Item, Size }) {
      this.belongsTo(Item, { foreignKey: 'id_item' });
      this.belongsTo(Size, { foreignKey: 'id_size' });
    }
  }
  Item_detail.init(
    {
      id_item_detail: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_size: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      price: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Item_detail',
      timestamps: false,
    },
  );
  return Item_detail;
};
