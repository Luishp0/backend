// controllers/UserController.ts
import { Request, Response } from 'express';
//import bcrypt from 'bcrypt';
import UsuarioModel, { IUser } from '../models/UsuarioModel';  // Importa el modelo de usuario
const key = 'clave';

function encryptPassword(password: string, key: string): string {
  let encryptedPassword = '';
  for (let i = 0; i < password.length; i++) {
      const passwordCharCode = password.charCodeAt(i);
      const keyCharCode = key.charCodeAt(i % key.length);
      const encryptedCharCode = (passwordCharCode + keyCharCode) % 256; // Utiliza 256 para asegurar que el resultado esté dentro del rango ASCII
      encryptedPassword += String.fromCharCode(encryptedCharCode);
  }
  return encryptedPassword;
}


export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roles_idroles, nombre, correo, contrasena, telefono } = req.body;

    // Generar el hash de la contraseña
   // const hashedPassword: string = await bcrypt.hash(contrasena, 10);

    // Encriptar la contraseña con cifrado de Vigenère
    const encryptedPassword = encryptPassword(contrasena, key);

    // Crear el nuevo usuario con la contraseña encriptada
    const nuevoUsuario: IUser = new UsuarioModel({
      roles_idroles,
      nombre,
      correo,
      contrasena: encryptedPassword,
      telefono,
    });

    // Guardar el nuevo usuario en la base de datos
    await nuevoUsuario.save();

    res.json({ message: 'Registro creado correctamente' });
  }  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
  
};
