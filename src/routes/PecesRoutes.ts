import express from 'express'
import { actualizarPez, crearPez, eliminarPez, obtenerPeces, obtenerPecesDeUsuario, obtenerPezPorId } from '../controllers/PecesController';


const router = express.Router();

router.post('/', crearPez)
router.get('/', obtenerPeces)
router.get('/:idUsuario', obtenerPecesDeUsuario)
router.get('/:id', obtenerPezPorId)
router.put('/:id', actualizarPez)
router.delete('/:id', eliminarPez)


export default router;
