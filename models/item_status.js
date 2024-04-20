'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item_status extends Model {
    static associate({ Item }) {
      this.hasMany(Item, { foreignKey: 'id_status' });
    }
  }
  Item_status.init(
    {
      id_status: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Item_status',
      timestamps: false,
    },
  );
  return Item_status;
};
