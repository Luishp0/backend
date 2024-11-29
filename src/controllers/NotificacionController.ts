import { Request, Response } from 'express';
import NotificacionModel, { INotificacion } from '../models/NotificacionModel';

// Obtener todas las notificaciones
export const obtenerTodasLasNotificaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener todas las notificaciones de la base de datos
    const notificaciones = await NotificacionModel.find();

    res.json(notificaciones);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva notificación para un usuario
export const crearNotificacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_usuario, mensaje, fecha, leido } = req.body;

    // Buscar el documento del usuario
    const usuarioNotificacion = await NotificacionModel.findOne({ id_usuario });

    if (!usuarioNotificacion) {
      // Si no existe, crea un nuevo documento
      const nuevaNotificacion: INotificacion = new NotificacionModel({
        id_usuario,
        notificacion: [{ mensaje, fecha, leido }],
      });

      await nuevaNotificacion.save();
      res.json({ message: 'Notificación creada correctamente', nuevaNotificacion });
    } else {
      // Si existe, agrega la notificación al array
      usuarioNotificacion.notificacion.push({ mensaje, fecha, leido });
      await usuarioNotificacion.save();
      res.json({ message: 'Notificación agregada correctamente', usuarioNotificacion });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las notificaciones de un usuario
export const obtenerNotificacionesPorUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_usuario } = req.params;

    // Buscar el documento por el ID del usuario
    const usuarioNotificacion = await NotificacionModel.findOne({ id_usuario });

    if (!usuarioNotificacion) {
      res.status(404).json({ message: 'No se encontraron notificaciones para este usuario' });
      return;
    }

    res.json(usuarioNotificacion.notificacion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una notificación específica
export const actualizarNotificacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { mensaje, fecha, leido } = req.body;

    // Buscar la notificación dentro del array
    const usuarioNotificacion = await NotificacionModel.findOneAndUpdate(
      { 'notificacion._id': id },
      {
        $set: {
          'notificacion.$.mensaje': mensaje,
          'notificacion.$.fecha': fecha,
          'notificacion.$.leido': leido,
        },
      },
      { new: true }
    );

    if (!usuarioNotificacion) {
      res.status(404).json({ message: 'Notificación no encontrada' });
      return;
    }

    res.json({ message: 'Notificación actualizada correctamente', usuarioNotificacion });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una notificación específica
export const eliminarNotificacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Eliminar una notificación específica del array
    const usuarioNotificacion = await NotificacionModel.findOneAndUpdate(
      { 'notificacion._id': id },
      { $pull: { notificacion: { _id: id } } },
      { new: true }
    );

    if (!usuarioNotificacion) {
      res.status(404).json({ message: 'Notificación no encontrada' });
      return;
    }

    res.json({ message: 'Notificación eliminada correctamente', usuarioNotificacion });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Marcar todas las notificaciones como leídas para un usuario
export const marcarTodasLeidas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_usuario } = req.params;

    // Actualizar todas las notificaciones del usuario
    const usuarioNotificacion = await NotificacionModel.findOneAndUpdate(
      { id_usuario },
      { $set: { 'notificacion.$[].leido': true } },
      { new: true }
    );

    if (!usuarioNotificacion) {
      res.status(404).json({ message: 'No se encontraron notificaciones para este usuario' });
      return;
    }

    res.json({ message: 'Todas las notificaciones marcadas como leídas', usuarioNotificacion });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const leerNotificacion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id_usuario, id_notificacion } = req.params;
  
      // Actualizar la notificación específica dentro del array
      const usuarioNotificacion = await NotificacionModel.findOneAndUpdate(
        { id_usuario, 'notificacion._id': id_notificacion }, // Busca el documento con la notificación específica
        { $set: { 'notificacion.$.leido': true } },         // Marca esa notificación como leída
        { new: true }                                       // Retorna el documento actualizado
      );
  
      if (!usuarioNotificacion) {
        res.status(404).json({ message: 'No se encontró la notificación especificada' });
        return;
      }
  
      res.json({
        message: 'Notificación marcada como leída',
        usuarioNotificacion,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  