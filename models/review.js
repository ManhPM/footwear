"use strict";
const { Model } = require("sequelize");
const date = new Date();
date.setHours(date.getHours() + 7);
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate({ Customer, Item }) {
      Review.belongsTo(Customer, { foreignKey: "id_customer" });
      Review.belongsTo(Item, { foreignKey: "id_item" });
    }
  }
  Review.init(
    {
      id_customer: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id_item: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      comment: DataTypes.STRING,
      createAt: {
        primaryKey: true,
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: date,
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Review",
      timestamps: false,
    }
  );
  return Review;
};
