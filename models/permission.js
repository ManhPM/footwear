'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate({ Role_has_permission }) {
      this.hasMany(Role_has_permission, { foreignKey: 'id_permission' });
    }
  }
  Permission.init(
    {
      id_permission: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Permission',
      timestamps: false,
    },
  );
  return Permission;
};
