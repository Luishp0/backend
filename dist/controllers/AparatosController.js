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
exports.obtenerEstadisticasAparatos = exports.buscarAparatos = exports.obtenerDatosGraficaAparatos = exports.visualizarAparatosPorRango = exports.visualizarAparatosPorNombre = exports.eliminarAparato = exports.actualizarAparato = exports.visualizarAparatoPorId = exports.visualizarAparatos = exports.crearAparato = void 0;
const AparatosModel_1 = __importDefault(require("../models/AparatosModel")); // Asegúrate de importar correctamente el modelo de aparatos
const crearAparato = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nuevoAparato = new AparatosModel_1.default(req.body);
        const aparatoGuardado = yield nuevoAparato.save();
        res.status(201).json(aparatoGuardado);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.crearAparato = crearAparato;
const visualizarAparatos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const aparatos = yield AparatosModel_1.default.find();
        res.json(aparatos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.visualizarAparatos = visualizarAparatos;
const visualizarAparatoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const aparato = yield AparatosModel_1.default.findById(id);
        if (!aparato) {
            res.status(404).json({ mensaje: 'Aparato no encontrado' });
            return;
        }
        res.json(aparato);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.visualizarAparatoPorId = visualizarAparatoPorId;
const actualizarAparato = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const aparatoActualizado = yield AparatosModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!aparatoActualizado) {
            res.status(404).json({ mensaje: 'Aparato no encontrado' });
            return;
        }
        res.json(aparatoActualizado);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.actualizarAparato = actualizarAparato;
const eliminarAparato = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const aparatoEliminado = yield AparatosModel_1.default.findByIdAndDelete(id);
        if (!aparatoEliminado) {
            res.status(404).json({ mensaje: 'Aparato no encontrado' });
            return;
        }
        res.json({ mensaje: 'Aparato eliminado correctamente', aparato: aparatoEliminado });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.eliminarAparato = eliminarAparato;
const visualizarAparatosPorNombre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nombreAparato = req.params.nombre;
        const aparatos = yield AparatosModel_1.default.find({ nombre: nombreAparato });
        if (aparatos.length === 0) {
            res.status(404).json({ mensaje: 'No se encontraron aparatos con ese nombre' });
            return;
        }
        res.json(aparatos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.visualizarAparatosPorNombre = visualizarAparatosPorNombre;
const visualizarAparatosPorRango = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const minimo = req.query.minimo;
        const maximo = req.query.maximo;
        if (!minimo || !maximo) {
            res.status(400).json({ mensaje: 'Los valores mínimo y máximo son requeridos' });
            return;
        }
        const aparatos = yield AparatosModel_1.default.find({
            minimo: { $gte: minimo },
            maximo: { $lte: maximo },
        });
        if (aparatos.length === 0) {
            res.status(404).json({ mensaje: 'No se encontraron aparatos en el rango especificado' });
            return;
        }
        res.json(aparatos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.visualizarAparatosPorRango = visualizarAparatosPorRango;
const obtenerDatosGraficaAparatos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const datos = yield AparatosModel_1.default.aggregate([
            {
                $group: {
                    _id: '$nombre',
                    estadoActivo: { $sum: { $cond: ['$estado', 1, 0] } },
                    estadoInactivo: { $sum: { $cond: ['$estado', 0, 1] } },
                },
            },
        ]);
        if (datos.length === 0) {
            res.status(404).json({ mensaje: 'No se encontraron datos para la gráfica' });
            return;
        }
        res.json(datos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.obtenerDatosGraficaAparatos = obtenerDatosGraficaAparatos;
const buscarAparatos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { minimo, maximo, estado } = req.query;
        const query = {};
        if (minimo)
            query.minimo = { $gte: minimo };
        if (maximo)
            query.maximo = { $lte: maximo };
        if (estado)
            query.estado = estado === 'true';
        const aparatos = yield AparatosModel_1.default.find(query);
        if (aparatos.length === 0) {
            res.status(404).json({ mensaje: 'No se encontraron aparatos con los filtros proporcionados' });
            return;
        }
        res.json(aparatos);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.buscarAparatos = buscarAparatos;
const obtenerEstadisticasAparatos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estadisticas = yield AparatosModel_1.default.aggregate([
            {
                $group: {
                    _id: '$nombre', // Agrupar por nombre del aparato
                    minimoMin: { $min: '$minimo' },
                    maximoMax: { $max: '$maximo' },
                    estadoActivo: { $sum: { $cond: ['$estado', 1, 0] } },
                    estadoInactivo: { $sum: { $cond: ['$estado', 0, 1] } },
                    total: { $sum: 1 },
                },
            },
        ]);
        if (estadisticas.length === 0) {
            res.status(404).json({ mensaje: 'No se encontraron estadísticas' });
            return;
        }
        res.json(estadisticas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.obtenerEstadisticasAparatos = obtenerEstadisticasAparatos;
