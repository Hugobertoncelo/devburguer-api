"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
const Order_1 = __importDefault(require("../schemas/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const User_1 = __importDefault(require("../models/User"));
class OrderController {
    async store(request, response) {
        const schema = Yup.object({
            products: Yup.array()
                .required()
                .of(Yup.object({
                id: Yup.number().required(),
                quantity: Yup.number().required(),
            })),
        });
        try {
            schema.validateSync(request.body, { abortEarly: false });
        }
        catch (err) {
            return response.status(400).json({ error: err.errors });
        }
        const { products } = request.body;
        const productsIds = products.map((product) => product.id);
        const findProducts = await Product_1.default.findAll({
            where: {
                id: productsIds,
            },
            include: [
                {
                    model: Category_1.default,
                    as: "category",
                    attributes: ["name"],
                },
            ],
        });
        const formattedProducts = findProducts.map((product) => {
            const productsIndex = products.findIndex((item) => item.id === product.id);
            const newProduct = {
                id: product.id,
                name: product.name,
                category: product.category?.name || "defaultCategory", // Ensure a value is present
                price: product.price,
                url: product.url || "defaultUrl", // Ensure a value is present
                quantity: products[productsIndex].quantity,
            };
            return newProduct;
        });
        const order = {
            user: {
                id: request.userId,
                name: request.userName || "defaultUserName", // Ensure a value is present
            },
            products: formattedProducts,
            status: "Pedido realizado",
        };
        const createdOrder = await Order_1.default.create(order);
        return response.status(201).json(createdOrder);
    }
    async index(request, response) {
        const orders = await Order_1.default.find();
        return response.json(orders);
    }
    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string().required(),
        });
        try {
            schema.validateSync(request.body, { abortEarly: false });
        }
        catch (err) {
            return response.status(400).json({ error: err.errors });
        }
        const { admin: isAdmin } = await User_1.default.findByPk(request.userId);
        if (!isAdmin) {
            return response.status(401).json();
        }
        const { id } = request.params;
        const { status } = request.body;
        try {
            await Order_1.default.updateOne({ _id: id }, { status });
        }
        catch (err) {
            return response.status(400).json({ error: err.message });
        }
        return response.json({ message: "Status updated successfully" });
    }
}
exports.default = new OrderController();
