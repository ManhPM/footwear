'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate({ Item }) {
      this.hasOne(Item, { foreignKey: 'id_item' });
    }
  }
  Type.init(
    {
      id_type: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Type',
      timestamps: false,
    },
  );
  return Type;
};
