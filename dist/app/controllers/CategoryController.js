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
const Category_1 = __importDefault(require("../models/Category"));
const User_1 = __importDefault(require("../models/User"));
class CategoryController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
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
        const { filename: path } = request.file;
        const { name } = request.body;
        const categoryExists = await Category_1.default.findOne({
            where: {
                name,
            },
        });
        if (categoryExists) {
            return response.status(400).json({ error: "Category already exists." });
        }
        const { id } = await Category_1.default.create({
            name,
            path,
        });
        return response.status(201).json({ id, name });
    }
    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),
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
        const categoryExists = await Category_1.default.findByPk(id);
        if (!categoryExists) {
            return response
                .status(400)
                .json({ message: "Make sure your category ID is correct" });
        }
        let path;
        if (request.file) {
            path = request.file.filename;
        }
        const { name } = request.body;
        if (name) {
            const categoryNameExists = await Category_1.default.findOne({
                where: {
                    name,
                },
            });
            if (categoryNameExists && categoryNameExists.id !== +id) {
                return response.status(400).json({ error: "Category already exists." });
            }
        }
        await Category_1.default.update({
            name,
            path,
        }, {
            where: {
                id,
            },
        });
        return response.status(200).json();
    }
    async index(request, response) {
        const categories = await Category_1.default.findAll();
        return response.json(categories);
    }
}
exports.default = new CategoryController();
