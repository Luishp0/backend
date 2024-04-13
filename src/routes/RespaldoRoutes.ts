import express from "express";
import { crearRespaldo, obtenerHistorial } from "../controllers/RespaldoController";


const router = express.Router();


router.get('/', crearRespaldo)
router.get('/historial', obtenerHistorial)

export default router
