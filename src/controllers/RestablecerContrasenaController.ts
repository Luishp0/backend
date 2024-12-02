import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import UserModel, { IUser } from '../models/UsuarioModel';

export const enviarCorreoRecuperacion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { correo } = req.body;

        const usuario: IUser | null = await UserModel.findOne({ correo });

        if (!usuario) {
            res.status(400).json({ error: 'El correo electrónico no está registrado.' });
            return;
        }

        const codigoVerificacion = Math.floor(1000 + Math.random() * 9000).toString();
        const hashCodigoVerificacion = await bcrypt.hash(codigoVerificacion, 10);

        usuario.codigoVerificacion = hashCodigoVerificacion;
        usuario.codigoVerificacionExpires = new Date(Date.now() + 3600000);

        await usuario.save();

        const transporter = nodemailer.createTransport({
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
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Correo enviado con éxito' });
            }
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const verificarCodigo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { correo, codigoVerificacion } = req.body;
        if (!correo || !codigoVerificacion) {
            res.status(400).json({ error: 'Correo y código de verificación son obligatorios.' });
            return;
        }

        const usuario: IUser | null = await UserModel.findOne({ correo });

        if (!usuario) {
            res.status(400).json({ error: 'El correo electrónico no está registrado.' });
            return;
        }

        if (!usuario.codigoVerificacion || !usuario.codigoVerificacionExpires || usuario.codigoVerificacionExpires < new Date()) {
            res.status(400).json({ error: 'Código de verificación inválido o expirado.' });
            return;
        }

        const isCodigoValido = await bcrypt.compare(codigoVerificacion, usuario.codigoVerificacion);

        if (!isCodigoValido) {
            res.status(400).json({ error: 'Código de verificación inválido.' });
            return;
        }

        res.status(200).json({ message: 'Código de verificación válido.' });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const reenviarCodigoVerificacion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { correo } = req.body;

        const usuario: IUser | null = await UserModel.findOne({ correo });

        if (!usuario) {
            res.status(400).json({ error: 'El correo electrónico no está registrado.' });
            return;
        }

        const codigoVerificacion = Math.floor(1000 + Math.random() * 9000).toString();
        const hashCodigoVerificacion = await bcrypt.hash(codigoVerificacion, 10);

        usuario.codigoVerificacion = hashCodigoVerificacion;
        usuario.codigoVerificacionExpires = new Date(Date.now() + 3600000);

        await usuario.save();

        const transporter = nodemailer.createTransport({
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
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Correo de verificación reenviado con éxito' });
            }
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { correo, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            res.status(400).json({ error: 'Las contraseñas no coinciden.' });
            return;
        }

        const usuario: IUser | null = await UserModel.findOne({ correo });

        if (!usuario) {
            res.status(400).json({ error: 'El correo electrónico no está registrado.' });
            return;
        }

        const isMatch = await bcrypt.compare(password, usuario.contrasena);
        if (isMatch) {
            res.status(400).json({ error: 'La nueva contraseña debe ser diferente a la anterior.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        usuario.contrasena = hashedPassword;

        await usuario.save();

        res.status(200).json({ success: true, message: 'Contraseña actualizada con éxito.' });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
