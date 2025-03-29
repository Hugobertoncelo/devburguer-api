import { Sequelize, Options } from "sequelize";

import { configDatabase } from "../config/database";

import User from "../app/models/User";
import Product from "../app/models/Product";
import Category from "../app/models/Category";

const models = [User, Product, Category];

class Database {
  connection!: Sequelize;

  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models
      // @ts-ignore
      .map((model) => model.init(this.connection))
      .map(
        // @ts-ignore
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
