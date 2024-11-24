"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificacionController_1 = require("../controllers/NotificacionController");
const router = (0, express_1.Router)();
// Ruta para obtener todas las notificaciones
router.get('/', NotificacionController_1.obtenerTodasLasNotificaciones);
// Ruta para crear una nueva notificación
router.post('/', NotificacionController_1.crearNotificacion);
// Ruta para obtener notificaciones por usuario
router.get('/:id_usuario', NotificacionController_1.obtenerNotificacionesPorUsuario);
// Ruta para actualizar una notificación específica
router.put('/:id', NotificacionController_1.actualizarNotificacion);
// Ruta para eliminar una notificación específica
router.delete('/:id', NotificacionController_1.eliminarNotificacion);
// Ruta para marcar todas las notificaciones como leídas
router.put('/marcar-todas-leidas/:id_usuario', NotificacionController_1.marcarTodasLeidas);
exports.default = router;
