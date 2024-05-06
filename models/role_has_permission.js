'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role_has_permission extends Model {
    static associate({ Permission, Role }) {
      this.belongsTo(Role, { foreignKey: 'id_role' });
      this.belongsTo(Permission, { foreignKey: 'id_permission' });
    }
  }
  Role_has_permission.init(
    {
      id_role: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_permission: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'Role_has_permission',
      timestamps: false,
    },
  );
  return Role_has_permission;
};
