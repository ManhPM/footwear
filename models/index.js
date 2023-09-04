"use strict";

import { readdirSync } from "fs";
import { basename as _basename, join } from "path";
import Sequelize, { DataTypes } from "sequelize";
import { env as _env } from "process";
const basename = _basename(__filename);
const db = {};
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

// == DEPOLOY ==
// const DB_USERNAME = "uk0i6dmxu7d8zh01";
// const DB_PASSWORD = "G7iMzeuh02vF8WQOfYrx";
// const DB_DBNAME = "bubvmp7xcurr0mbnpx7i";

// sequelize = new Sequelize(DB_DBNAME, DB_USERNAME, DB_PASSWORD, config);

readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
