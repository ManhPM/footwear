"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Export extends Model {
    static associate({ Staff, Export_detail }) {
      this.belongsTo(Staff, { foreignKey: "id_staff" });
      this.hasMany(Export_detail, { foreignKey: "id_export" });
    }
  }
  Export.init(
    {
      id_export: {
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
      modelName: "Export",
      timestamps: false,
    }
  );
  return Export;
};
