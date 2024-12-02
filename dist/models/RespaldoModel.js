"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const respaldoSchema = new mongoose_1.default.Schema({
    fecha: { type: Date, required: true }
});
const RespaldoModel = mongoose_1.default.model('Respaldo', respaldoSchema);
exports.default = RespaldoModel;
