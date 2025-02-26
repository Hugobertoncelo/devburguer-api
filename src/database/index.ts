import { Sequelize } from "sequelize";

const configDatabase = require("../config/database");

import User from "../app/models/User";

const models = [User];

class Database {
  connection!: Sequelize;

  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
