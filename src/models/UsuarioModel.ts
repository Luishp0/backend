import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  roles_idroles: number;
  nombre: string;
  correo: string;
  fechaNacimiento: Date;
  contrasena: string;
  telefono: string;
  __v: number;
  codigoVerificacion?: string;
  codigoVerificacionExpires?: Date;
  fotos?: {
    url: string;
  };
}

const usuarioSchema = new mongoose.Schema({
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

const UserModel = mongoose.model<IUser>('usuarios', usuarioSchema);

export default UserModel;
