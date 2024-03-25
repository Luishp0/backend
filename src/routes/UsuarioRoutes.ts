import express from 'express';
import { actualizarUsuario, crearUsuario, eliminarUsuario, visualizarUsuarioPorNombre, visualizarUsuarios } from '../controllers/UsuarioController';

const router = express.Router();

router.post('/', crearUsuario);
router.get('/', visualizarUsuarios);
router.get('/:nombre', visualizarUsuarioPorNombre);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);




export default router;
