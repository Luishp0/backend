"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RespaldoController_1 = require("../controllers/RespaldoController");
const router = express_1.default.Router();
router.get('/', RespaldoController_1.crearRespaldo);
router.get('/historial', RespaldoController_1.obtenerHistorial);
router.get('/descargar/:nombreArchivo', RespaldoController_1.descargarArchivo);
exports.default = router;
