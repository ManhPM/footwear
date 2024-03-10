'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account_verify extends Model {
    static associate({ Account, Item }) {
      this.belongsTo(Account, { foreignKey: 'id_account' });
    }
  }
  Account_verify.init(
    {
      id_account: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      verify_code: DataTypes.INTEGER,
      expire_time: {
        type: DataTypes.DATE,
        primaryKey: true,
      },
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Account_verify',
      timestamps: false,
    },
  );
  return Account_verify;
};
