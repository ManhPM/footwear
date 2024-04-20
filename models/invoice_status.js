'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice_status extends Model {
    static associate({ Invoice }) {
      this.hasMany(Invoice, { foreignKey: 'id_status' });
    }
  }
  Invoice_status.init(
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
      modelName: 'Invoice_status',
      timestamps: false,
    },
  );
  return Invoice_status;
};
