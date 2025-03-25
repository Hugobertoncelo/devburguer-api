"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const node_path_1 = require("node:path");
const cors_1 = __importDefault(require("cors"));
require("./database");
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use("/product-file", express_1.default.static((0, node_path_1.resolve)(__dirname, "..", "uploads")));
        this.app.use("/category-file", express_1.default.static((0, node_path_1.resolve)(__dirname, "..", "uploads")));
    }
    routes() {
        this.app.use(routes_1.default);
    }
}
exports.default = new App().app;
