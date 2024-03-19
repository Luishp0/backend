// models/UsuarioModel.ts

import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  roles_idroles: string;
  nombre: string;
  correo: string;
  contrasena: string;
  telefono: string;
}

const usuarioSchema = new mongoose.Schema({
  roles_idroles: { type: Number, required: true },
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true},
  contrasena: { type: String, required: true },
  telefono: { type: Number, required: true },
});

const UserModel = mongoose.model<IUser>('usuarios', usuarioSchema);

export default UserModel;
