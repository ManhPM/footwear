'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    static associate({ Export, Import, Account }) {
      this.hasMany(Export, { foreignKey: 'id_staff' });
      this.hasMany(Import, { foreignKey: 'id_staff' });
      this.hasOne(Account, { foreignKey: 'id_account' });
    }
  }
  Staff.init(
    {
      id_staff: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      tableName: 'staffs',
      sequelize,
      modelName: 'Staff',
      timestamps: false,
    },
  );
  return Staff;
};
