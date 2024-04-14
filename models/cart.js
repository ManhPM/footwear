'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate({ Customer, Item_detail }) {
      this.belongsTo(Customer, { foreignKey: 'id_customer' });
      this.belongsTo(Item_detail, { foreignKey: 'id_item_detail' });
    }
  }
  Cart.init(
    {
      id_customer: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_item_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Cart',
      timestamps: false,
    },
  );
  return Cart;
};
