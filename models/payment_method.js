'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment_method extends Model {
    static associate({ Invoice }) {
      this.hasMany(Invoice, { foreignKey: 'id_payment_method' });
    }
  }
  Payment_method.init(
    {
      id_payment_method: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Payment_method',
      timestamps: false,
    },
  );
  return Payment_method;
};
