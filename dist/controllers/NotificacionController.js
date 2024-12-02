"use strict";
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
exports.marcarTodasLeidas = exports.eliminarNotificacion = exports.actualizarNotificacion = exports.obtenerNotificacionesPorUsuario = exports.crearNotificacion = exports.obtenerTodasLasNotificaciones = void 0;
const NotificacionModel_1 = __importDefault(require("../models/NotificacionModel"));
// Obtener todas las notificaciones
const obtenerTodasLasNotificaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener todas las notificaciones de la base de datos
        const notificaciones = yield NotificacionModel_1.default.find();
        res.json(notificaciones);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.obtenerTodasLasNotificaciones = obtenerTodasLasNotificaciones;
// Crear una nueva notificación para un usuario
const crearNotificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario, mensaje, fecha, leido } = req.body;
        // Buscar el documento del usuario
        const usuarioNotificacion = yield NotificacionModel_1.default.findOne({ id_usuario });
        if (!usuarioNotificacion) {
            // Si no existe, crea un nuevo documento
            const nuevaNotificacion = new NotificacionModel_1.default({
                id_usuario,
                notificacion: [{ mensaje, fecha, leido }],
            });
            yield nuevaNotificacion.save();
            res.json({ message: 'Notificación creada correctamente', nuevaNotificacion });
        }
        else {
            // Si existe, agrega la notificación al array
            usuarioNotificacion.notificacion.push({ mensaje, fecha, leido });
            yield usuarioNotificacion.save();
            res.json({ message: 'Notificación agregada correctamente', usuarioNotificacion });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.crearNotificacion = crearNotificacion;
// Obtener todas las notificaciones de un usuario
const obtenerNotificacionesPorUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.params;
        // Buscar el documento por el ID del usuario
        const usuarioNotificacion = yield NotificacionModel_1.default.findOne({ id_usuario });
        if (!usuarioNotificacion) {
            res.status(404).json({ message: 'No se encontraron notificaciones para este usuario' });
            return;
        }
        res.json(usuarioNotificacion.notificacion);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.obtenerNotificacionesPorUsuario = obtenerNotificacionesPorUsuario;
// Actualizar una notificación específica
const actualizarNotificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { mensaje, fecha, leido } = req.body;
        // Buscar la notificación dentro del array
        const usuarioNotificacion = yield NotificacionModel_1.default.findOneAndUpdate({ 'notificacion._id': id }, {
            $set: {
                'notificacion.$.mensaje': mensaje,
                'notificacion.$.fecha': fecha,
                'notificacion.$.leido': leido,
            },
        }, { new: true });
        if (!usuarioNotificacion) {
            res.status(404).json({ message: 'Notificación no encontrada' });
            return;
        }
        res.json({ message: 'Notificación actualizada correctamente', usuarioNotificacion });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.actualizarNotificacion = actualizarNotificacion;
// Eliminar una notificación específica
const eliminarNotificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Eliminar una notificación específica del array
        const usuarioNotificacion = yield NotificacionModel_1.default.findOneAndUpdate({ 'notificacion._id': id }, { $pull: { notificacion: { _id: id } } }, { new: true });
        if (!usuarioNotificacion) {
            res.status(404).json({ message: 'Notificación no encontrada' });
            return;
        }
        res.json({ message: 'Notificación eliminada correctamente', usuarioNotificacion });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.eliminarNotificacion = eliminarNotificacion;
// Marcar todas las notificaciones como leídas para un usuario
const marcarTodasLeidas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_usuario } = req.params;
        // Actualizar todas las notificaciones del usuario
        const usuarioNotificacion = yield NotificacionModel_1.default.findOneAndUpdate({ id_usuario }, { $set: { 'notificacion.$[].leido': true } }, { new: true });
        if (!usuarioNotificacion) {
            res.status(404).json({ message: 'No se encontraron notificaciones para este usuario' });
            return;
        }
        res.json({ message: 'Todas las notificaciones marcadas como leídas', usuarioNotificacion });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.marcarTodasLeidas = marcarTodasLeidas;
