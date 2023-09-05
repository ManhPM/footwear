"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Import_invoice extends Model {
    static associate({ User, Import_invoice_detail }) {
      this.belongsTo(User, { foreignKey: "id_user" });
      this.hasMany(Import_invoice_detail, { foreignKey: "id_i_invoice" });
    }
  }
  Import_invoice.init(
    {
      id_i_invoice: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createAt: DataTypes.DATE,
      status: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Import_invoice",
      timestamps: false,
    }
  );
  return Import_invoice;
};
