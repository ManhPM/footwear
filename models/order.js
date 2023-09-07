"use strict";
const { Model } = require("sequelize");
const date = new Date();
date.setHours(date.getHours() + 7);
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate({ User, Payment_method, Order_detail, Discount }) {
      this.belongsTo(User, { foreignKey: "id_user" });
      this.belongsTo(Payment_method, { foreignKey: "id_payment" });
      this.hasMany(Order_detail, { foreignKey: "id_order" });
    }
  }
  Order.init(
    {
      id_order: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      time_order: {
        type: DataTypes.DATE,
        defaultValue: date,
      },
      id_shipper: DataTypes.INTEGER,
      time_confirm: DataTypes.DATE,
      time_shipper_receive: DataTypes.DATE,
      time_shipper_delivered: DataTypes.DATE,
      delivery_fee: DataTypes.INTEGER,
      item_fee: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
      timestamps: false,
    }
  );
  return Order;
};
