'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate({ Item }) {
      this.hasMany(Item, { foreignKey: 'id_material' });
    }
  }
  Material.init(
    {
      id_material: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Material',
      timestamps: false,
    },
  );
  return Material;
};
