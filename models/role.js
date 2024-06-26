'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate({ Account, Role_has_permission }) {
      this.hasOne(Account, { foreignKey: 'id_account' });
      this.hasMany(Role_has_permission, { foreignKey: 'id_role' });
    }
  }
  Role.init(
    {
      id_role: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Role',
      timestamps: false,
    },
  );
  return Role;
};
