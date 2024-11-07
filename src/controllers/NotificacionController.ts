import { Request, Response } from 'express';
import NotificacionModel from '../models/NotificacionesModel'; // Ajusta el path según la ubicación del modelo

// Controlador para obtener todas las notificaciones
export const visualizarNotificaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener todos los documentos de la colección de notificación
    const notificaciones = await NotificacionModel.find({}, 'notificacion');

    // Enviar la lista de notificaciones como respuesta
    res.json(notificaciones);
  } catch (error: any) {
    // Manejar errores
    res.status(500).json({ error: error.message });
  }
};
