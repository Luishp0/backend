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
exports.descargarArchivo = exports.obtenerHistorial = exports.crearRespaldo = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const archiver_1 = __importDefault(require("archiver"));
const RespaldoModel_1 = __importDefault(require("../models/RespaldoModel"));
// Función para crear un respaldo
const crearRespaldo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Crear una ruta de respaldo con la fecha y hora actual
        const fechaActual = new Date();
        const fechaString = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
        const horaString = `${fechaActual.getHours().toString().padStart(2, '0')}-${fechaActual.getMinutes().toString().padStart(2, '0')}`;
        const rutaRespaldo = path_1.default.join(__dirname, `../../respaldos/respaldo_${fechaString}_${horaString}`);
        // Comando de mongodump con la ruta dinámica
        const comando = `mongodump --uri="mongodb://localhost:27017/Pecera" --out="${rutaRespaldo}"`;
        (0, child_process_1.exec)(comando, (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                console.error(`Error al ejecutar el comando: ${error}`);
                res.status(500).json({ message: 'Error al realizar el respaldo' });
                return;
            }
            // Ruta del archivo .zip
            const archivoZip = `${rutaRespaldo}.zip`;
            // Crear un archivo .zip
            const salida = fs_1.default.createWriteStream(archivoZip);
            const archivo = (0, archiver_1.default)('zip', {
                zlib: { level: 9 }, // Nivel de compresión
            });
            salida.on('close', () => __awaiter(void 0, void 0, void 0, function* () {
                console.log(`Archivo .zip creado con éxito: ${archivoZip}`);
                // Crear un nuevo documento de respaldo
                const nuevoRespaldo = new RespaldoModel_1.default({
                    fecha: fechaActual,
                    ruta: archivoZip, // Guardar la ruta del archivo zip
                });
                // Guardar el documento en la base de datos
                yield nuevoRespaldo.save();
                res.status(200).json({ message: 'Respaldo realizado correctamente', ruta: archivoZip });
            }));
            archivo.on('error', (err) => {
                console.error(`Error al crear el archivo .zip: ${err}`);
                res.status(500).json({ message: 'Error al comprimir el respaldo' });
            });
            archivo.pipe(salida);
            // Agregar el directorio de respaldo al archivo .zip
            archivo.directory(rutaRespaldo, false);
            // Finalizar el proceso de archivado
            archivo.finalize();
        }));
    }
    catch (error) {
        console.error(`Error al realizar el respaldo: ${error}`);
        res.status(500).json({ message: 'Error al realizar el respaldo' });
    }
});
exports.crearRespaldo = crearRespaldo;
// Función para obtener el historial de respaldos
const obtenerHistorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener el historial de respaldos ordenado por fecha de forma descendente
        const historial = yield RespaldoModel_1.default.find().sort({ fecha: -1 }).exec();
        // Transformar el formato de las fechas y horas
        const formattedHistorial = historial.map((backup) => ({
            date: `${backup.fecha.getDate()}/${backup.fecha.getMonth() + 1}/${backup.fecha.getFullYear()}`,
            time: `${backup.fecha.getHours()}:${backup.fecha.getMinutes().toString().padStart(2, '0')}`,
        }));
        res.status(200).json({ historial: formattedHistorial });
    }
    catch (error) {
        console.error(`Error al obtener el historial de respaldos: ${error}`);
        res.status(500).json({ message: 'Error al obtener el historial de respaldos' });
    }
});
exports.obtenerHistorial = obtenerHistorial;
// Función para descargar el respaldo
const descargarArchivo = (req, res) => {
    const { nombreArchivo } = req.params; // nombreArchivo debe ser 'respaldo_2024-08-18_19-37.zip'
    const archivoRuta = path_1.default.join(__dirname, `../../respaldos/${nombreArchivo}`);
    console.log(`Archivo solicitado: ${nombreArchivo}`);
    console.log(`Ruta del archivo: ${archivoRuta}`);
    if (fs_1.default.existsSync(archivoRuta) && fs_1.default.statSync(archivoRuta).isFile()) {
        res.setHeader('Content-Type', 'application/zip'); // Asegúrate de establecer el tipo de contenido adecuado
        res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`); // Esto fuerza la descarga en lugar de mostrar el archivo
        // Enviar el archivo como un stream para evitar problemas de memoria con archivos grandes
        const fileStream = fs_1.default.createReadStream(archivoRuta);
        fileStream.pipe(res);
        fileStream.on('error', (err) => {
            console.error(`Error al leer el archivo: ${err}`);
            res.status(500).json({ message: 'Error al descargar el archivo' });
        });
    }
    else {
        console.error(`Archivo no encontrado o no es un archivo: ${archivoRuta}`);
        res.status(404).json({ message: 'Archivo no encontrado' });
    }
};
exports.descargarArchivo = descargarArchivo;
