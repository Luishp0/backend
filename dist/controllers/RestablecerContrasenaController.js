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
exports.resetPassword = exports.reenviarCodigoVerificacion = exports.verificarCodigo = exports.enviarCorreoRecuperacion = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UsuarioModel_1 = __importDefault(require("../models/UsuarioModel"));
const enviarCorreoRecuperacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correo } = req.body;
        const usuario = yield UsuarioModel_1.default.findOne({ correo });
        if (!usuario) {
            res.status(400).json({ error: 'El correo electrónico no está registrado.' });
            return;
        }
        const codigoVerificacion = Math.floor(1000 + Math.random() * 9000).toString();
        const hashCodigoVerificacion = yield bcrypt_1.default.hash(codigoVerificacion, 10);
        usuario.codigoVerificacion = hashCodigoVerificacion;
        usuario.codigoVerificacionExpires = new Date(Date.now() + 3600000);
        yield usuario.save();
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo,
            subject: 'Código de Verificación',
            html: `
                <h2>Código de Verificación</h2>
                <p>Utiliza el siguiente código de verificación para restablecer tu contraseña:</p>
                <h1>${codigoVerificacion}</h1>
            `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Error al enviar el correo' });
            }
            else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Correo enviado con éxito' });
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.enviarCorreoRecuperacion = enviarCorreoRecuperacion;
const verificarCodigo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correo, codigoVerificacion } = req.body;
        if (!correo || !codigoVerificacion) {
            res.status(400).json({ error: 'Correo y código de verificación son obligatorios.' });
            return;
        }
        const usuario = yield UsuarioModel_1.default.findOne({ correo });
        if (!usuario) {
            res.status(400).json({ error: 'El correo electrónico no está registrado.' });
            return;
        }
        if (!usuario.codigoVerificacion || !usuario.codigoVerificacionExpires || usuario.codigoVerificacionExpires < new Date()) {
            res.status(400).json({ error: 'Código de verificación inválido o expirado.' });
            return;
        }
        const isCodigoValido = yield bcrypt_1.default.compare(codigoVerificacion, usuario.codigoVerificacion);
        if (!isCodigoValido) {
            res.status(400).json({ error: 'Código de verificación inválido.' });
            return;
        }
        res.status(200).json({ message: 'Código de verificación válido.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.verificarCodigo = verificarCodigo;
const reenviarCodigoVerificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correo } = req.body;
        const usuario = yield UsuarioModel_1.default.findOne({ correo });
        if (!usuario) {
            res.status(400).json({ error: 'El correo electrónico no está registrado.' });
            return;
        }
        const codigoVerificacion = Math.floor(1000 + Math.random() * 9000).toString();
        const hashCodigoVerificacion = yield bcrypt_1.default.hash(codigoVerificacion, 10);
        usuario.codigoVerificacion = hashCodigoVerificacion;
        usuario.codigoVerificacionExpires = new Date(Date.now() + 3600000);
        yield usuario.save();
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo,
            subject: 'Código de Verificación',
            html: `
                <h2>Código de Verificación</h2>
                <p>Utiliza el siguiente código de verificación para restablecer tu contraseña:</p>
                <h1>${codigoVerificacion}</h1>
            `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Error al enviar el correo' });
            }
            else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Correo de verificación reenviado con éxito' });
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.reenviarCodigoVerificacion = reenviarCodigoVerificacion;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { correo, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            res.status(400).json({ error: 'Las contraseñas no coinciden.' });
            return;
        }
        const usuario = yield UsuarioModel_1.default.findOne({ correo });
        if (!usuario) {
            res.status(400).json({ error: 'El correo electrónico no está registrado.' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, usuario.contrasena);
        if (isMatch) {
            res.status(400).json({ error: 'La nueva contraseña debe ser diferente a la anterior.' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        usuario.contrasena = hashedPassword;
        yield usuario.save();
        res.status(200).json({ success: true, message: 'Contraseña actualizada con éxito.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.resetPassword = resetPassword;
