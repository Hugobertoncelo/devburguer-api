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
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../../config/auth"));
class SessionController {
    async store(request, response) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        });
        const isValid = await schema.isValid(request.body);
        const emailOrPasswordIncorrect = () => {
            return response
                .status(401)
                .json({ error: "Make sure your email or password are correct" });
        };
        if (!isValid) {
            return emailOrPasswordIncorrect();
        }
        const { email, password } = request.body;
        const user = await User_1.default.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            return emailOrPasswordIncorrect();
        }
        const isSamePassword = await user.checkPassword(password);
        if (!isSamePassword) {
            return emailOrPasswordIncorrect();
        }
        return response.status(201).json({
            id: user.id,
            name: user.name,
            email,
            admin: user.admin,
            token: jsonwebtoken_1.default.sign({ id: user.id, name: user.name }, auth_1.default.secret, {
                expiresIn: auth_1.default.expiresIn,
            }),
        });
    }
}
exports.default = new SessionController();
