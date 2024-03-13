'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Import extends Model {
    static associate({ Staff, Import_detail, Provider }) {
      this.belongsTo(Staff, { foreignKey: 'id_staff' });
      this.belongsTo(Provider, { foreignKey: 'id_provider' });
      this.hasMany(Import_detail, { foreignKey: 'id_import' });
    }
  }
  Import.init(
    {
      id_import: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      datetime: DataTypes.DATE,
      status: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Import',
      timestamps: false,
    },
  );
  return Import;
};
