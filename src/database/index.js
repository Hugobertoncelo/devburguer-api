"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("../app/models/User"));
const Product_1 = __importDefault(require("../app/models/Product"));
const Category_1 = __importDefault(require("../app/models/Category"));
const models = [User_1.default, Product_1.default, Category_1.default];
class Database {
    connection;
    constructor() {
        this.init();
        // this.mongo();
    }
    init() {
        this.connection = new sequelize_1.Sequelize(database_1.default);
        models
            .map((model) => model.init(this.connection))
            .map((model) => model.associate && model.associate(this.connection.models));
    }
}
exports.default = new Database();
