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
    const { roles_idroles, nombre, fechaNacimiento, correo, contrasena, telefono } = req.body;

    // Generar el hash de la contraseña
   // const hashedPassword: string = await bcrypt.hash(contrasena, 10);

    // Encriptar la contraseña con cifrado de Vigenère
    const encryptedPassword = encryptPassword(contrasena, key);

    // Crear el nuevo usuario con la contraseña encriptada
    const nuevoUsuario: IUser = new UsuarioModel({
      roles_idroles,
      nombre,
      fechaNacimiento,
      correo,
      contrasena: encryptedPassword,
      telefono,
    });

    // Guardar el nuevo usuario en la base de datos
    await nuevoUsuario.save();

    res.json({ message: 'Registro creado correctamente', nuevoUsuario });
  }  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
  
};

// Controlador para obtener todos los usuarios
export const visualizarUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener todos los usuarios de la base de datos
    const usuarios: IUser[] = await UsuarioModel.find();

    // Enviar la lista de usuarios como respuesta
    res.json(usuarios);
  } catch (error: any) {
    // Manejar errores
    res.status(500).json({ error: error.message });
  }
};

// Controlador para actualizar un usuario
export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Obtener el ID del usuario a actualizar
    const { roles_idroles, nombre, correo, contrasena, telefono } = req.body;

    // Verificar si el usuario existe
    const usuarioExistente: IUser | null = await UsuarioModel.findById(id);
    if (!usuarioExistente) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Actualizar los datos del usuario
    usuarioExistente.roles_idroles = roles_idroles;
    usuarioExistente.nombre = nombre;
    usuarioExistente.correo = correo;
    usuarioExistente.contrasena = contrasena;
    usuarioExistente.telefono = telefono;

    // Guardar los cambios en la base de datos
    await usuarioExistente.save();

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error: any) {
    // Manejar errores
    res.status(500).json({ error: error.message });
  }
};

// Controlador para eliminar un usuario
export const eliminarUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Obtener el ID del usuario a eliminar

    // Verificar si el usuario existe
    const usuarioExistente: IUser | null = await UsuarioModel.findById(id);
    if (!usuarioExistente) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
    // Eliminar el usuario de la base de datos
    await UsuarioModel.findByIdAndDelete(id);

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error: any) {
    // Manejar errores
    res.status(500).json({ error: error.message });
  }
};
//controlador para visualizar usuario por nombre
export const visualizarUsuarioPorNombre = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el nombre del usuario desde los parámetros de la solicitud
    const nombreUsuario = req.params.nombre;

    // Buscar el usuario por su nombre en la base de datos
    const usuario: IUser [] = await UsuarioModel.find({ nombre: nombreUsuario });

    // Verificar si se encontró el usuario
    if (!usuario) {
       res.status(404).json({ mensaje: 'Usuario no encontrado' });
       return;
      }

    // Enviar el usuario encontrado como respuesta
    res.json(usuario);
  } catch (error: any) {
    // Manejar errores
    res.status(500).json({ error: error.message });
  }
};
