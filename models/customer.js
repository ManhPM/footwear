"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate({
      Cart,
      Wishlist,
      Review,
      Invoice,
    }) {
      this.hasMany(Cart, { foreignKey: "id_customer" });
      this.hasMany(Wishlist, { foreignKey: "id_customer" });
      this.hasMany(Review, { foreignKey: "id_customer" });
      this.hasMany(Invoice, { foreignKey: "id_invoice" });
    }
  }
  Customer.init(
    {
      id_customer: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      image: {
        type: DataTypes.STRING,
        defaultValue:
          "http://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
    },
    {
      tableName: "customers",
      sequelize,
      modelName: "Customer",
      timestamps: false,
    }
  );
  return Customer;
};
