"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const usuarioSchema = new mongoose_1.default.Schema({
    roles_idroles: { type: Number, required: true, default: 2 },
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    fechaNacimiento: { type: Date, required: true },
    contrasena: { type: String, required: true },
    telefono: { type: String, required: true },
    codigoVerificacion: String,
    codigoVerificacionExpires: Date,
    fotos: {
        url: { type: String },
    },
});
const UserModel = mongoose_1.default.model('usuarios', usuarioSchema);
exports.default = UserModel;
