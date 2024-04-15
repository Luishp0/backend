import express from 'express';
import { actualizarUsuario, crearUsuario, eliminarUsuario, loginUser, visualizarUsuarioPorNombre, visualizarUsuarios } from '../controllers/UsuarioController';
import { enviarCorreoRecuperacion } from '../controllers/RestablecerCorreoController';

const router = express.Router();

router.post('/', crearUsuario);
router.get('/', visualizarUsuarios);
router.get('/:nombre', visualizarUsuarioPorNombre);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);
router.post('/login', loginUser)

router.post('/correo', enviarCorreoRecuperacion)



export default router;
