'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice_detail extends Model {
    static associate({ Item, Invoice }) {
      this.belongsTo(Item, { foreignKey: 'id_item' });
      this.belongsTo(Invoice, { foreignKey: 'id_invoice' });
    }
  }
  Invoice_detail.init(
    {
      id_invoice: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      quantity: DataTypes.INTEGER,
      unit_price: DataTypes.STRING,
      reviewed: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Invoice_detail',
      timestamps: false,
    },
  );
  return Invoice_detail;
};
