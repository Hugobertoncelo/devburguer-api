"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const node_path_1 = require("node:path");
exports.default = {
    storage: multer_1.default.diskStorage({
        destination: (0, node_path_1.resolve)(__dirname, "..", "..", "uploads"),
        filename: (request, file, callback) => callback(null, (0, uuid_1.v4)() + (0, node_path_1.extname)(file.originalname)),
    }),
};
