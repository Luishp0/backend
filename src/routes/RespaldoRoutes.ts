import express from "express";
import { crearRespaldo, descargarArchivo,  obtenerHistorial } from "../controllers/RespaldoController";


const router = express.Router();


router.get('/', crearRespaldo)
router.get('/historial', obtenerHistorial)
router.get('/descargar/:nombreArchivo', descargarArchivo);

export default router
