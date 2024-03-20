import express from 'express';
import { actualizarUsuario, crearUsuario, eliminarUsuario, visualizarUsuarios } from '../controllers/UsuarioController';

const router = express.Router();

router.post('/', crearUsuario);
router.get('/', visualizarUsuarios);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);


export default router;
