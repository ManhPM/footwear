'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Size extends Model {
    static associate({ Item_detail }) {
      this.hasMany(Item_detail, { foreignKey: 'id_size' });
    }
  }
  Size.init(
    {
      id_size: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Size',
      timestamps: false,
    },
  );
  return Size;
};
