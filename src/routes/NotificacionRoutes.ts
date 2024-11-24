import { Router } from 'express';
import {
  obtenerTodasLasNotificaciones,
  crearNotificacion,
  obtenerNotificacionesPorUsuario,
  actualizarNotificacion,
  eliminarNotificacion,
  marcarTodasLeidas,
} from '../controllers/NotificacionController';

const router = Router();

// Ruta para obtener todas las notificaciones
router.get('/', obtenerTodasLasNotificaciones);

// Ruta para crear una nueva notificación
router.post('/', crearNotificacion);

// Ruta para obtener notificaciones por usuario
router.get('/:id_usuario', obtenerNotificacionesPorUsuario);

// Ruta para actualizar una notificación específica
router.put('/:id', actualizarNotificacion);

// Ruta para eliminar una notificación específica
router.delete('/:id', eliminarNotificacion);

// Ruta para marcar todas las notificaciones como leídas
router.put('/marcar-todas-leidas/:id_usuario', marcarTodasLeidas);

export default router;
