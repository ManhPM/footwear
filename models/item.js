'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate({ Wishlist, Item_detail, Type, Origin, Brand, Material }) {
      this.hasMany(Wishlist, { foreignKey: 'id_item' });
      this.hasMany(Item_detail, { foreignKey: 'id_item' });
      this.belongsTo(Type, { foreignKey: 'id_type' });
      this.belongsTo(Origin, { foreignKey: 'id_origin' });
      this.belongsTo(Brand, { foreignKey: 'id_brand' });
      this.belongsTo(Material, { foreignKey: 'id_material' });
    }
  }
  Item.init(
    {
      id_item: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Item',
      timestamps: false,
    },
  );
  return Item;
};
