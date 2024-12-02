import express from 'express';
import { actualizarUsuario, contarUsuarios, crearUsuario, eliminarUsuario, loginUser, saveSubscription, visualizarUsuarioPorNombre, visualizarUsuarios } from '../controllers/UsuarioController';
import { enviarCorreoRecuperacion, reenviarCodigoVerificacion, resetPassword, verificarCodigo } from '../controllers/RestablecerContrasenaController';

const router = express.Router();

router.post('/', crearUsuario);
router.get('/', visualizarUsuarios);
router.get('/contador', contarUsuarios);
router.get('/:nombre', visualizarUsuarioPorNombre);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);
router.post('/enviarcorreo', enviarCorreoRecuperacion);

router.post('/login', loginUser)
router.post('/suscripciones/subscribe', saveSubscription);


router.post('/verificarcodigo', verificarCodigo);
router.post('/reenviarcodigo', reenviarCodigoVerificacion)
router.post('/resetcontrasena', resetPassword);



export default router;
