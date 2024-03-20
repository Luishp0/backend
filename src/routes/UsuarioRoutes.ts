import express from 'express';
import { actualizarUsuario, crearUsuario, visualizarUsuarios } from '../controllers/UsuarioController';

const router = express.Router();

router.post('/', crearUsuario);
router.get('/', visualizarUsuarios);
router.put('/:id', actualizarUsuario);


export default router;
