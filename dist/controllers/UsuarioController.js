"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contarUsuarios = exports.loginUser = exports.visualizarUsuarioPorNombre = exports.eliminarUsuario = exports.actualizarUsuario = exports.visualizarUsuarios = exports.crearUsuario = void 0;
//import bcrypt from 'bcrypt';
const UsuarioModel_1 = __importDefault(require("../models/UsuarioModel")); // Importa el modelo de usuario
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crearUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roles_idroles, nombre, fechaNacimiento, correo, contrasena, telefono } = req.body;
        // Verificar si el usuario ya existe
        const usuarioExistente = yield UsuarioModel_1.default.findOne({ correo });
        if (usuarioExistente) {
            res.status(400).json({ errors: { correo: 'El correo electrónico ya está registrado' } });
            return;
        }
        // Comprobar si la contraseña está definida
        if (!contrasena) {
            res.status(400).json({ errors: { contrasena: 'La contraseña es requerida' } });
            return;
        }
        // Generar el hash de la contraseña con bcrypt
        const hashedPassword = yield bcrypt_1.default.hash(contrasena, 10);
        // Crear el nuevo usuario con la contraseña encriptada
        const nuevoUsuario = new UsuarioModel_1.default({
            roles_idroles,
            nombre,
            fechaNacimiento,
            correo,
            contrasena: hashedPassword,
            telefono,
        });
        // Guardar el nuevo usuario en la base de datos
        yield nuevoUsuario.save();
        res.json({ message: 'Registro creado correctamente', nuevoUsuario });
    }
    catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al registrar el usuario' });
    }
});
exports.crearUsuario = crearUsuario;
// Controlador para obtener todos los usuarios
const visualizarUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener todos los usuarios de la base de datos
        const usuarios = yield UsuarioModel_1.default.find();
        // Enviar la lista de usuarios como respuesta
        res.json(usuarios);
    }
    catch (error) {
        // Manejar errores
        res.status(500).json({ error: error.message });
    }
});
exports.visualizarUsuarios = visualizarUsuarios;
// Controlador para actualizar un usuario
const actualizarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Obtener el ID del usuario a actualizar
        const { roles_idroles, nombre, correo, fechaNacimiento, telefono, fotos } = req.body; // Agregar fotos al destructuring
        // Verificar si el usuario existe
        const usuarioExistente = yield UsuarioModel_1.default.findById(id);
        if (!usuarioExistente) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        // Actualizar los datos del usuario
        usuarioExistente.roles_idroles = roles_idroles;
        usuarioExistente.nombre = nombre;
        usuarioExistente.correo = correo;
        usuarioExistente.fechaNacimiento = fechaNacimiento;
        usuarioExistente.telefono = telefono;
        // Actualizar el campo de fotos si está presente
        if (fotos) {
            usuarioExistente.fotos = fotos;
        }
        // Guardar los cambios en la base de datos
        yield usuarioExistente.save();
        res.json({ message: 'Usuario actualizado correctamente' });
    }
    catch (error) {
        // Manejar errores
        res.status(500).json({ error: error.message });
    }
});
exports.actualizarUsuario = actualizarUsuario;
// Controlador para eliminar un usuario
const eliminarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Obtener el ID del usuario a eliminar
        // Verificar si el usuario existe
        const usuarioExistente = yield UsuarioModel_1.default.findById(id);
        if (!usuarioExistente) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        // Eliminar el usuario de la base de datos
        yield UsuarioModel_1.default.findByIdAndDelete(id);
        res.json({ message: 'Usuario eliminado correctamente' });
    }
    catch (error) {
        // Manejar errores
        res.status(500).json({ error: error.message });
    }
});
exports.eliminarUsuario = eliminarUsuario;
//controlador para visualizar usuario por nombre
const visualizarUsuarioPorNombre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener el nombre del usuario desde los parámetros de la solicitud
        const nombreUsuario = req.params.nombre;
        // Buscar el usuario por su nombre en la base de datos
        const usuario = yield UsuarioModel_1.default.find({ nombre: nombreUsuario });
        // Verificar si se encontró el usuario
        if (!usuario) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
            return;
        }
        // Enviar el usuario encontrado como respuesta
        res.json(usuario);
    }
    catch (error) {
        // Manejar errores
        res.status(500).json({ error: error.message });
    }
});
exports.visualizarUsuarioPorNombre = visualizarUsuarioPorNombre;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contrasena } = req.body;
    try {
        // Verifica si el usuario existe
        const usuario = yield UsuarioModel_1.default.findOne({ correo });
        if (!usuario) {
            res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
            return;
        }
        // Verifica si la contraseña es correcta
        const isPasswordCorrect = yield bcrypt_1.default.compare(contrasena, usuario.contrasena);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
            return;
        }
        // Genera el token de autenticación
        const token = jsonwebtoken_1.default.sign({ correo: usuario.correo, id: usuario._id }, 'claveSecreta', { expiresIn: '1h' });
        res.status(200).json({
            result: {
                token,
                id: usuario._id,
                roles_idroles: usuario.roles_idroles,
                nombre: usuario.nombre,
                telefono: usuario.telefono,
                correo: usuario.correo,
                fechaNacimiento: usuario.fechaNacimiento,
                fotos: usuario.fotos
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});
exports.loginUser = loginUser;
const contarUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Contar todos los usuarios en la base de datos
        const totalUsuarios = yield UsuarioModel_1.default.countDocuments();
        // Enviar el número total de usuarios como respuesta
        res.json({ totalUsuarios });
    }
    catch (error) {
        console.error("Error al contar los usuarios:", error.message);
        // Manejar errores
        res.status(500).json({ error: error.message });
    }
});
exports.contarUsuarios = contarUsuarios;
