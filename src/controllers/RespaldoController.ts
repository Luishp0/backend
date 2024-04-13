import { Request, Response } from 'express';
import { exec } from 'child_process';
import RespaldoModel, { IRespaldo } from '../models/RespaldoModel';

export const crearRespaldo = async (req: Request, res: Response): Promise<void> => {
    try {
        // Ejecutar el comando de mongodump
        const comando = 'mongodump --uri="mongodb://localhost:27017/Pecera" --out="C:\\Users\\soylu\\OneDrive\\Escritorio\\Evaluacion\\backend\\src\\config\\respaldos"';

        exec(comando, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar el comando: ${error}`);
                res.status(500).json({ message: 'Error al realizar el respaldo' });
                return;
            }

            // Obtener la fecha y hora actual
            const fechaActual = new Date();

            // Crear un nuevo documento de respaldo
            const nuevoRespaldo = new RespaldoModel({
                fecha: fechaActual,
            });

            // Guardar el documento en la base de datos
            await nuevoRespaldo.save();

            console.log('Respaldo realizado correctamente');
            res.status(200).json({ message: 'Respaldo realizado correctamente' });
        });
    } catch (error) {
        console.error(`Error al realizar el respaldo: ${error}`);
        res.status(500).json({ message: 'Error al realizar el respaldo' });
    }
};

export const obtenerHistorial = async (req: Request, res: Response): Promise<void> => {
    try {
        // Obtener el historial de respaldos ordenado por fecha de forma descendente
        const historial = await RespaldoModel.find().sort({ fecha: -1 }).exec();

        // Transformar el formato de las fechas y horas
        const formattedHistorial = historial.map((backup: IRespaldo) => ({
            date: `${backup.fecha.getDate()}/${backup.fecha.getMonth() + 1}/${backup.fecha.getFullYear()}`,
            time: `${backup.fecha.getHours()}:${backup.fecha.getMinutes().toString().padStart(2, '0')}`,
        }));

        res.status(200).json({ historial: formattedHistorial }); // Enviar un JSON válido con el historial
    } catch (error) {
        console.error(`Error al obtener el historial de respaldos: ${error}`);
        res.status(500).json({ message: 'Error al obtener el historial de respaldos' });
    }
};
