import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import UserModel, { IUser } from '../models/UsuarioModel';

export const enviarCorreoRecuperacion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { correo } = req.body;

        // Buscar el usuario por correo electrónico
        const usuario: IUser | null = await UserModel.findOne({ correo });

        if (!usuario) {
            res.status(400).json({ error: 'El correo electrónico no está registrado.' });
            return; // Añadimos return aquí para salir de la función si el usuario no se encuentra
        }

        // Generar token de restablecimiento de contraseña
        const token = crypto.randomBytes(20).toString('hex');

        // Guardar el token en el usuario
        usuario.resetPasswordToken = token;
        usuario.resetPasswordExpires = new Date(Date.now() + 3600000) as any; // 1 hora en milisegundos

        await usuario.save();
        

        // Configurar nodemailer
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
            subject: 'Recuperación de Contraseña',
            html: `
                <h2>Recuperación de Contraseña</h2>
                <p>Haz clic en el enlace de abajo para restablecer tu contraseña:</p>
                <a href="http://localhost:3000/reset-password/${token}">Restablecer Contraseña</a>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al enviar el correo');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Correo enviado con éxito');
            }
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
