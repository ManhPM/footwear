"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate({ Item }) {
      this.hasMany(Item, { foreignKey: "id_type" });
    }
  }
  Type.init(
    {
      id_type: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Type",
      timestamps: false,
    }
  );
  return Type;
};
