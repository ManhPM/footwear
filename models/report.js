'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Report_detail}) {
      this.hasOne(Report_detail, { foreignKey: "id_report" });
    }
  }
  Report.init({
    id_report: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    revenue: DataTypes.INTEGER,
    countOrder: {
      type: DataTypes.INTEGER,
      underscored: false,
    },
    date: DataTypes.DATE
  }, {
    tableName: 'reports',
    sequelize,
    modelName: 'Report',
    timestamps: false,
  });
  return Report;
};