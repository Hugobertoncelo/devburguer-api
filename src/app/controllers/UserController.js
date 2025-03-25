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
const uuid_1 = require("uuid");
const Yup = __importStar(require("yup"));
const User_1 = __importDefault(require("../models/User"));
class UserController {
    async store(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
            admin: Yup.boolean(),
        });
        try {
            schema.validateSync(request.body, { abortEarly: false });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError) {
                return response.status(400).json({ error: err.errors });
            }
            return response.status(500).json({ error: "Internal server error" });
        }
        const { name, email, password, admin } = request.body;
        const userExists = await User_1.default.findOne({
            where: {
                email,
            },
        });
        if (userExists) {
            return response.status(400).json({ error: "User already exists" });
        }
        console.log(userExists);
        const user = await User_1.default.create({
            id: (0, uuid_1.v4)(),
            name,
            email,
            password,
            admin,
        });
        return response.status(201).json({
            id: user.id,
            name,
            email,
            admin,
        });
    }
}
exports.default = new UserController();
