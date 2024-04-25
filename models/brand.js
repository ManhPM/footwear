'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate({ Item }) {
      this.hasMany(Item, { foreignKey: 'id_brand' });
    }
  }
  Brand.init(
    {
      id_brand: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Brand',
      timestamps: false,
    },
  );
  return Brand;
};
