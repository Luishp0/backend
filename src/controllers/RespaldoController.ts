import { Request, Response } from 'express';
import { exec } from 'child_process';
import RespaldoModel from '../models/RespaldoModel';

export const crearRespaldo = async (req: Request, res: Response): Promise<void> => {
    // Obtener la fecha y hora actual
    const fechaActual = new Date();

    // Crear un nuevo documento de respaldo
    const nuevoRespaldo = new RespaldoModel({
        fecha: fechaActual,
    });

    // Guardar el documento en la base de datos
    try {
        await nuevoRespaldo.save();
    } catch (error) {
        console.error(`Error al guardar el respaldo en la base de datos: ${error}`);
        res.status(500).json({ message: 'Error al realizar el respaldo' });
        return;
    }

    // Ejecutar el comando de mongodump
    const comando = 'mongodump --uri="mongodb://localhost:27017/Pecera" --out="C:\\Users\\soylu\\OneDrive\\Escritorio\\Evaluacion\\backend\\src\\config\\respaldos"';

    exec(comando, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al ejecutar el comando: ${error}`);
            res.status(500).json({ message: 'Error al realizar el respaldo' });
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        console.log('Respaldo realizado correctamente');
        res.status(200).json({ message: 'Respaldo realizado correctamente' });
    });
};
