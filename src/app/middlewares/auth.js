"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../../config/auth"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(request, response, next) {
    const authToken = request.headers.authorization;
    if (!authToken) {
        return response.status(401).json({ error: "Token não fornecido" });
    }
    const token = authToken.split(" ")[1];
    try {
        jsonwebtoken_1.default.verify(token, auth_1.default.secret, (err, decoded) => {
            if (err) {
                throw new Error("Token inválido");
            }
            request.userId = decoded.id;
            request.userName = decoded.name;
            next();
        });
    }
    catch (err) {
        return response.status(401).json({ error: "O token é inválido" });
    }
}
exports.default = authMiddleware;
