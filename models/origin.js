'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Origin extends Model {
    static associate({ Item }) {
      this.hasMany(Item, { foreignKey: 'id_origin' });
    }
  }
  Origin.init(
    {
      id_type: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Origin',
      timestamps: false,
    },
  );
  return Origin;
};
