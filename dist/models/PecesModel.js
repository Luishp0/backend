"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Definir el esquema de la colección de peces
const pezSchema = new mongoose_1.default.Schema({
    nombre: { type: String, required: true },
    tipo: { type: String, required: true },
    descripcion: { type: String, required: true },
    parametros: {
        nombre: { type: String, required: true },
        valorSugerido: { type: Number, required: true }
    },
    alimentacion: {
        alimento: { type: String, required: true },
        cantidad: { type: String, required: true },
        frecuencia: { type: String, required: true }
    },
    idUsuario: { type: String, required: true }
});
// Crear el modelo de Mongoose para la colección de peces
const PezModel = mongoose_1.default.model('Peces', pezSchema, 'peces');
exports.default = PezModel;
