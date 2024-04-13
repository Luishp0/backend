import express from 'express'
import { actualizarSensor, crearSensor, eliminarSensor, obtenerSensores } from '../controllers/SensoresController';

const router = express.Router();

router.post('/', crearSensor)
router.get('/', obtenerSensores)
router.put('/:id', actualizarSensor)
router.delete('/:id', eliminarSensor)



export default router;