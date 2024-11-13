"use strict";
// controllers/PezController.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contarPeces = exports.obtenerPecesDeUsuario = exports.eliminarPez = exports.actualizarPez = exports.obtenerPezPorId = exports.obtenerPeces = exports.crearPez = void 0;
const PecesModel_1 = __importDefault(require("../models/PecesModel")); // Importar el modelo de peces
// Controlador para crear un nuevo pez
const crearPez = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, tipo, descripcion, parametros, alimentacion, idUsuario } = req.body;
        // Crear un nuevo documento de pez con los datos proporcionados
        const nuevoPez = new PecesModel_1.default({
            nombre,
            tipo,
            descripcion,
            parametros,
            alimentacion,
            idUsuario
        });
        // Guardar el nuevo pez en la base de datos
        yield nuevoPez.save();
        res.json({ message: 'Pez creado correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.crearPez = crearPez;
// Controlador para obtener todos los peces
const obtenerPeces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener todos los peces de la base de datos
        const peces = yield PecesModel_1.default.find();
        res.json(peces);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.obtenerPeces = obtenerPeces;
// Controlador para obtener un pez por su ID
const obtenerPezPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Buscar un pez por su ID en la base de datos
        const pez = yield PecesModel_1.default.findById(id);
        if (!pez) {
            res.status(404).json({ message: 'Pez no encontrado' });
            return;
        }
        res.json(pez);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.obtenerPezPorId = obtenerPezPorId;
// Controlador para actualizar un pez por su ID
const actualizarPez = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { nombre, tipo, descripcion, parametros, alimentacion, idUsuario } = req.body;
        // Verificar si el pez existe
        const pezExistente = yield PecesModel_1.default.findById(id);
        if (!pezExistente) {
            res.status(404).json({ message: 'Pez no encontrado' });
            return;
        }
        // Actualizar los datos del pez
        pezExistente.nombre = nombre;
        pezExistente.tipo = tipo;
        pezExistente.descripcion = descripcion;
        pezExistente.parametros = parametros;
        pezExistente.alimentacion = alimentacion;
        pezExistente.idUsuario = idUsuario;
        // Guardar los cambios en la base de datos
        yield pezExistente.save();
        res.json({ message: 'Pez actualizado correctamente', pez: pezExistente });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.actualizarPez = actualizarPez;
// Controlador para eliminar un pez por su ID
const eliminarPez = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Verificar si el pez existe
        const pezExistente = yield PecesModel_1.default.findById(id);
        if (!pezExistente) {
            res.status(404).json({ message: 'Pez no encontrado' });
            return;
        }
        // Eliminar el pez de la base de datos
        yield PecesModel_1.default.findByIdAndDelete(id);
        res.json({ message: 'Pez eliminado correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.eliminarPez = eliminarPez;
// Controlador para obtener todos los peces asociados a un usuario
const obtenerPecesDeUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUsuario } = req.params;
        // Buscar todos los peces asociados al usuario en la base de datos
        const peces = yield PecesModel_1.default.find({ id_usuario: idUsuario }).lean();
        if (peces.length === 0) {
            res.status(404).json({ mensaje: "No se encontraron peces para este usuario" });
            return;
        }
        res.json(peces);
    }
    catch (error) {
        console.error('Error al obtener peces:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
exports.obtenerPecesDeUsuario = obtenerPecesDeUsuario;
// Controlador para contar todos los peces
const contarPeces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Contar todos los peces en la base de datos
        const totalPeces = yield PecesModel_1.default.countDocuments();
        // Enviar el número total de peces como respuesta
        res.json({ totalPeces });
    }
    catch (error) {
        // Manejar errores
        res.status(500).json({ error: error.message });
    }
});
exports.contarPeces = contarPeces;
