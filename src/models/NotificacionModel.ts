import mongoose, { Document, Schema } from 'mongoose';

// Interfaz para una notificación individual
interface INotificacionItem {
  mensaje: string;
  fecha: Date;
  leido: boolean;
}

// Interfaz para el documento principal
export interface INotificacion extends Document {
  id_usuario: mongoose.Types.ObjectId; // Referencia al usuario
  notificacion: INotificacionItem[];  // Array de notificaciones
}

// Esquema para las notificaciones individuales
const notificacionItemSchema = new Schema<INotificacionItem>({
  mensaje: { type: String, required: true },
  fecha: { type: Date, required: true },
  leido: { type: Boolean, required: true, default: false },
});

// Esquema para el documento principal
const notificacionSchema = new Schema<INotificacion>({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true }, // Relación con usuarios
  notificacion: { type: [notificacionItemSchema], required: true }, // Array de notificaciones
});

// Modelo de notificaciones
const NotificacionModel = mongoose.model<INotificacion>('notificacion', notificacionSchema);

export default NotificacionModel;
