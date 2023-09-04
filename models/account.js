"use strict";
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate({ Staff, Shipper, Customer }) {
      this.hasOne(Staff, { foreignKey: "id_account" });
      this.hasOne(Shipper, { foreignKey: "id_account" });
      this.hasOne(Customer, { foreignKey: "id_account" });
    }
  }
  Account.init(
    {
      id_account: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      isActive: {
        type: DataTypes.INTEGER,
      },
      role: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "accounts",
      sequelize,
      modelName: "Account",
      timestamps: false,
    }
  );
  return Account;
};
