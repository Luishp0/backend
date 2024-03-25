import express from 'express'
import { actualizarSensor, crearSensor, eliminarSensor, obtenerSensores } from '../controllers/SensoresController';
import { obtenerPezPorId } from '../controllers/PecesController';

const router = express.Router();

router.post('/', crearSensor)
router.get('/', obtenerSensores)
router.get('/:id', obtenerPezPorId)
router.put('/:id', actualizarSensor)
router.delete('/:id', eliminarSensor)



export default router;