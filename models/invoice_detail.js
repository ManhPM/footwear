'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice_detail extends Model {
    static associate({ Item_detail, Invoice }) {
      this.belongsTo(Item_detail, { foreignKey: 'id_item_detail' });
      this.belongsTo(Invoice, { foreignKey: 'id_invoice' });
    }
  }
  Invoice_detail.init(
    {
      id_invoice: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_item_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      quantity: DataTypes.INTEGER,
      unit_price: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Invoice_detail',
      timestamps: false,
    },
  );
  return Invoice_detail;
};
