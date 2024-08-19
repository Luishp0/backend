import { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import RespaldoModel, { IRespaldo } from '../models/RespaldoModel';

// Función para crear un respaldo
export const crearRespaldo = async (req: Request, res: Response): Promise<void> => {
    try {
        // Crear una ruta de respaldo con la fecha y hora actual
        const fechaActual = new Date();
        const fechaString = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
        const horaString = `${fechaActual.getHours().toString().padStart(2, '0')}-${fechaActual.getMinutes().toString().padStart(2, '0')}`;
        const rutaRespaldo = path.join(__dirname, `../../respaldos/respaldo_${fechaString}_${horaString}`);

        // Comando de mongodump con la ruta dinámica
        const comando = `mongodump --uri="mongodb://localhost:27017/Pecera" --out="${rutaRespaldo}"`;

        exec(comando, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar el comando: ${error}`);
                res.status(500).json({ message: 'Error al realizar el respaldo' });
                return;
            }

            // Crear un nuevo documento de respaldo
            const nuevoRespaldo = new RespaldoModel({
                fecha: fechaActual,
                ruta: rutaRespaldo, // Guardar la ruta del respaldo
            });

            // Guardar el documento en la base de datos
            await nuevoRespaldo.save();

            console.log('Respaldo realizado correctamente');
            res.status(200).json({ message: 'Respaldo realizado correctamente', ruta: rutaRespaldo });
        });
    } catch (error) {
        console.error(`Error al realizar el respaldo: ${error}`);
        res.status(500).json({ message: 'Error al realizar el respaldo' });
    }
};

// Función para obtener el historial de respaldos
export const obtenerHistorial = async (req: Request, res: Response): Promise<void> => {
    try {
        // Obtener el historial de respaldos ordenado por fecha de forma descendente
        const historial = await RespaldoModel.find().sort({ fecha: -1 }).exec();

        // Transformar el formato de las fechas y horas
        const formattedHistorial = historial.map((backup: IRespaldo) => ({
            date: `${backup.fecha.getDate()}/${backup.fecha.getMonth() + 1}/${backup.fecha.getFullYear()}`,
            time: `${backup.fecha.getHours()}:${backup.fecha.getMinutes().toString().padStart(2, '0')}`,
            
        }));

        res.status(200).json({ historial: formattedHistorial });
    } catch (error) {
        console.error(`Error al obtener el historial de respaldos: ${error}`);
        res.status(500).json({ message: 'Error al obtener el historial de respaldos' });
    }
};

// Función para descargar el respaldo
export const descargarRespaldo = (req: Request, res: Response): void => {
    const { ruta } = req.params;

    // Verificar si el archivo existe y enviarlo como respuesta
    const archivoRuta = path.join(__dirname, `../../respaldos/${ruta}`);
    if (fs.existsSync(archivoRuta)) {
        res.download(archivoRuta, (err) => {
            if (err) {
                console.error(`Error al descargar el archivo: ${err}`);
                res.status(500).json({ message: 'Error al descargar el archivo' });
            }
        });
    } else {
        res.status(404).json({ message: 'Archivo no encontrado' });
    }
};
