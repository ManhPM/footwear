'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Cart, Item}) {
      this.belongsTo(Cart, { foreignKey: "id_cart" });
      this.belongsTo(Item, { foreignKey: "id_item" });
      // define association here
    }
  }
  Cart_detail.init({
    id_cart: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_item: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart_detail',
    timestamps: false,
    underscored: true
  });
  return Cart_detail;
};