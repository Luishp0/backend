import express from "express";
import { crearRespaldo } from "../controllers/RespaldoController";


const router = express.Router();


router.get('/', crearRespaldo)

export default router
