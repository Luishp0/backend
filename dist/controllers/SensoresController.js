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
exports.contarSensores = exports.eliminarSensor = exports.actualizarSensor = exports.obtenerSensorPorId = exports.obtenerSensores = exports.crearSensor = void 0;
const SensoresModel_1 = __importDefault(require("../models/SensoresModel")); // Importar el modelo de sensores
// Controlador para crear un nuevo sensor
const crearSensor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tipo, unidadMedida, valorNumerico } = req.body;
        // Crear un nuevo documento de sensor con los datos proporcionados
        const nuevoSensor = new SensoresModel_1.default({
            tipo,
            unidadMedida,
            valorNumerico
        });
        // Guardar el nuevo sensor en la base de datos
        yield nuevoSensor.save();
        res.json({ message: 'Sensor creado correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.crearSensor = crearSensor;
// Controlador para obtener todos los sensores
const obtenerSensores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener todos los sensores de la base de datos
        const sensores = yield SensoresModel_1.default.find();
        res.json(sensores);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.obtenerSensores = obtenerSensores;
// Controlador para obtener un sensor por su ID
const obtenerSensorPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Buscar un sensor por su ID en la base de datos
        const sensor = yield SensoresModel_1.default.findById(id);
        if (!sensor) {
            res.status(404).json({ message: 'Sensor no encontrado' });
            return;
        }
        res.json(sensor);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.obtenerSensorPorId = obtenerSensorPorId;
// Controlador para actualizar un sensor por su ID
const actualizarSensor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { tipo, unidadMedida } = req.body;
        // Verificar si el sensor existe
        const sensorExistente = yield SensoresModel_1.default.findById(id);
        if (!sensorExistente) {
            res.status(404).json({ message: 'Sensor no encontrado' });
            return;
        }
        // Actualizar los datos del sensor
        sensorExistente.tipo = tipo;
        sensorExistente.unidadMedida = unidadMedida;
        // Guardar los cambios en la base de datos
        yield sensorExistente.save();
        res.json({ message: 'Sensor actualizado correctamente', sensor: sensorExistente });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.actualizarSensor = actualizarSensor;
// Controlador para eliminar un sensor por su ID
const eliminarSensor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Verificar si el sensor existe
        const sensorExistente = yield SensoresModel_1.default.findById(id);
        if (!sensorExistente) {
            res.status(404).json({ message: 'Sensor no encontrado' });
            return;
        }
        // Eliminar el sensor de la base de datos
        yield SensoresModel_1.default.findByIdAndDelete(id);
        res.json({ message: 'Sensor eliminado correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.eliminarSensor = eliminarSensor;
// Controlador para contar todos los sensores
const contarSensores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Contar todos los sensores en la base de datos
        const totalSensores = yield SensoresModel_1.default.countDocuments();
        // Enviar el número total de sensores como respuesta
        res.json({ totalSensores });
    }
    catch (error) {
        // Manejar errores
        res.status(500).json({ error: error.message });
    }
});
exports.contarSensores = contarSensores;
