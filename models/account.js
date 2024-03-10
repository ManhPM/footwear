'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate({ Customer, Staff }) {
      this.hasOne(Customer, { foreignKey: 'id_account' });
      this.hasOne(Staff, { foreignKey: 'id_account' });
    }
  }
  Account.init(
    {
      id_account: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Account',
      timestamps: false,
    },
  );
  return Account;
};
