"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({
      Cart,
      Wishlist,
      Review,
      Order,
      Import_invoice,
      Report,
    }) {
      this.hasMany(Cart, { foreignKey: "id_user" });
      this.hasMany(Wishlist, { foreignKey: "id_user" });
      this.hasMany(Review, { foreignKey: "id_user" });
      this.hasMany(Order, { foreignKey: "id_user" });
      this.hasMany(Import_invoice, { foreignKey: "id_user" });
    }
  }
  User.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      image: {
        type: DataTypes.STRING,
        defaultValue:
          "https://res.cloudinary.com/dpgjnngzt/image/upload/v1692954334/anhdaidien_onsafn.jpg",
      },
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      role: DataTypes.STRING,
      verifyID: DataTypes.INTEGER,
      activeID: DataTypes.INTEGER,
    },
    {
      tableName: "users",
      sequelize,
      modelName: "User",
      timestamps: false,
    }
  );
  return User;
};
