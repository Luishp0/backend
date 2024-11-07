import mongoose, { Document } from 'mongoose';

// Definir la interfaz para los documentos de notificación
interface INotificacion {
  mensaje: string;
  fecha: Date;
  leido: boolean;
}

// Definir la interfaz para los documentos de la colección de notificación
export interface INotificacionDocument extends Document {
  notificacion: INotificacion[];
  id_usuario: string;
}

// Definir el esquema de la colección de notificación
const notificacionSchema = new mongoose.Schema({
  notificacion: [
    {
      mensaje: { type: String, required: true },
      fecha: { type: Date, required: true },
      leido: { type: Boolean, required: true, default: false },
    }
  ],
  id_usuario: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Usuarios' }
});

// Crear el modelo de Mongoose para la colección de notificación
const NotificacionModel = mongoose.model<INotificacionDocument>(
  'Notificacion',
  notificacionSchema,
  'notificacion' // Asegúrate de que este nombre coincida con el de la colección en MongoDB
);

export default NotificacionModel;
