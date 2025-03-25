"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multer_2 = __importDefault(require("./config/multer"));
const auth_1 = __importDefault(require("./app/middlewares/auth"));
const UserController_1 = __importDefault(require("./app/controllers/UserController"));
const SessionController_1 = __importDefault(require("./app/controllers/SessionController"));
const ProductController_1 = __importDefault(require("./app/controllers/ProductController"));
const CategoryController_1 = __importDefault(require("./app/controllers/CategoryController"));
const OrderController_1 = __importDefault(require("./app/controllers/OrderController"));
const CreatePaymentIntentController_1 = __importDefault(require("./app/controllers/stripe/CreatePaymentIntentController"));
const routes = (0, express_1.Router)();
const upload = (0, multer_1.default)(multer_2.default);
routes.post("/users", UserController_1.default.store);
routes.post("/session", SessionController_1.default.store);
routes.use(auth_1.default);
routes.post("/products", upload.single("file"), ProductController_1.default.store);
routes.get("/products", ProductController_1.default.index);
routes.put("/products/:id", upload.single("file"), ProductController_1.default.update);
routes.post("/categories", upload.single("file"), CategoryController_1.default.store);
routes.get("/categories", CategoryController_1.default.index);
routes.put("/categories/:id", upload.single("file"), CategoryController_1.default.update);
routes.post("/orders", OrderController_1.default.store);
routes.get("/orders", OrderController_1.default.index);
routes.put("/orders/:id", OrderController_1.default.update);
routes.post("/create-payment-intent", CreatePaymentIntentController_1.default.store);
exports.default = routes;
