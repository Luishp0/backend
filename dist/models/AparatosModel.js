"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const aparatosSchema = new mongoose_1.default.Schema({
    nombre: { type: String, required: true },
    minimo: { type: Number, requied: true },
    maximo: { type: Number, required: true },
    estado: { type: Boolean, required: true }
});
const AparatosModel = mongoose_1.default.model('aparatos', aparatosSchema);
exports.default = AparatosModel;
