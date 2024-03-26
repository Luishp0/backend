import express from 'express';
import { actualizarUsuario, crearUsuario, eliminarUsuario, loginUser, visualizarUsuarioPorNombre, visualizarUsuarios } from '../controllers/UsuarioController';

const router = express.Router();

router.post('/', crearUsuario);
router.get('/', visualizarUsuarios);
router.get('/:nombre', visualizarUsuarioPorNombre);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);
router.post('/login', loginUser)



export default router;
