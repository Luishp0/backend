import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  roles_idroles: number;
  nombre: string;
  correo: string;
  fechaNacimiento: Date;
  contrasena: string;
  telefono: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  codigoVerificacion?: string;
  codigoVerificacionExpires?: Date;
}

const usuarioSchema = new mongoose.Schema({
  roles_idroles: { type: Number, required: true },
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  fechaNacimiento: { type: Date, required: true },
  contrasena: { type: String, required: true },
  telefono: { type: String, required: true },
  codigoVerificacion: String,
  codigoVerificacionExpires: Date,
});

const UserModel = mongoose.model<IUser>('usuarios', usuarioSchema);

export default UserModel;
