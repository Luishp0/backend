import { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
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

            // Ruta del archivo .zip
            const archivoZip = `${rutaRespaldo}.zip`;

            // Crear un archivo .zip
            const salida = fs.createWriteStream(archivoZip);
            const archivo = archiver('zip', {
                zlib: { level: 9 }, // Nivel de compresión
            });

            salida.on('close', async () => {
                console.log(`Archivo .zip creado con éxito: ${archivoZip}`);

                // Crear un nuevo documento de respaldo
                const nuevoRespaldo = new RespaldoModel({
                    fecha: fechaActual,
                    ruta: archivoZip, // Guardar la ruta del archivo zip
                });

                // Guardar el documento en la base de datos
                await nuevoRespaldo.save();

                res.status(200).json({ message: 'Respaldo realizado correctamente', ruta: archivoZip });
            });

            archivo.on('error', (err) => {
                console.error(`Error al crear el archivo .zip: ${err}`);
                res.status(500).json({ message: 'Error al comprimir el respaldo' });
            });

            archivo.pipe(salida);

            // Agregar el directorio de respaldo al archivo .zip
            archivo.directory(rutaRespaldo, false);

            // Finalizar el proceso de archivado
            archivo.finalize();
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
export const descargarArchivo = (req: Request, res: Response): void => {
    const { nombreArchivo } = req.params; // nombreArchivo debe ser 'respaldo_2024-08-18_19-37.zip'
    const archivoRuta = path.join(__dirname, `../../respaldos/${nombreArchivo}`);

    console.log(`Archivo solicitado: ${nombreArchivo}`);
    console.log(`Ruta del archivo: ${archivoRuta}`);

    if (fs.existsSync(archivoRuta) && fs.statSync(archivoRuta).isFile()) {
        res.setHeader('Content-Type', 'application/zip'); // Asegúrate de establecer el tipo de contenido adecuado
        res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`); // Esto fuerza la descarga en lugar de mostrar el archivo

        // Enviar el archivo como un stream para evitar problemas de memoria con archivos grandes
        const fileStream = fs.createReadStream(archivoRuta);
        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error(`Error al leer el archivo: ${err}`);
            res.status(500).json({ message: 'Error al descargar el archivo' });
        });
    } else {
        console.error(`Archivo no encontrado o no es un archivo: ${archivoRuta}`);
        res.status(404).json({ message: 'Archivo no encontrado' });
    }
};
