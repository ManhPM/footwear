'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Import_detail extends Model {
    static associate({ Import, Item_detail }) {
      this.belongsTo(Import, { foreignKey: 'id_import' });
      this.belongsTo(Item_detail, { foreignKey: 'id_item_detail' });
    }
  }
  Import_detail.init(
    {
      id_import: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_item_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      quantity: DataTypes.INTEGER,
      unit_price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Import_detail',
      timestamps: false,
    },
  );
  return Import_detail;
};
