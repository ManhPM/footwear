'use strict';
const { Model } = require('sequelize');
const date = new Date();
date.setHours(date.getHours() + 7);
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate({ Customer, Invoice_detail, Staff }) {
      this.belongsTo(Customer, { foreignKey: 'id_customer' });
      this.belongsTo(Staff, { foreignKey: 'id_staff' });
      this.hasMany(Invoice_detail, { foreignKey: 'id_invoice' });
    }
  }
  Invoice.init(
    {
      id_invoice: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      payment_method: DataTypes.STRING,
      datetime: {
        type: DataTypes.DATE,
        defaultValue: date,
      },
      ship_fee: DataTypes.INTEGER,
      item_fee: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      invoice_status: DataTypes.INTEGER,
      payment_status: DataTypes.INTEGER,
      address: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Invoice',
      timestamps: false,
    },
  );
  return Invoice;
};
