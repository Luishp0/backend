import { Router } from "express";
import { visualizarNotificaciones } from "../controllers/NotificacionController";



const router  = Router();

router.get('/', visualizarNotificaciones)


export default router