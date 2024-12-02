import express from 'express';
import { actualizarUsuario, contarUsuarios, crearUsuario, eliminarUsuario, loginUser,   visualizarUsuarioPorNombre, visualizarUsuarios } from '../controllers/UsuarioController';
import { enviarCorreoRecuperacion, reenviarCodigoVerificacion, resetPassword, verificarCodigo } from '../controllers/RestablecerContrasenaController';
import {  saveOrUpdateSubscription, sendNotificationToAll, sendNotificationToUsers } from '../controllers/EnviarNotificacion';

const router = express.Router();

router.post('/', crearUsuario);
router.get('/', visualizarUsuarios);
router.get('/contador', contarUsuarios);
router.get('/:nombre', visualizarUsuarioPorNombre);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);
router.post('/enviarcorreo', enviarCorreoRecuperacion);

router.post('/login', loginUser)
router.post('/suscripciones/subscribe', saveOrUpdateSubscription);
router.post('/notificacion/enviar', sendNotificationToUsers); 
router.post('/notitifacion/activos', sendNotificationToAll)



router.post('/verificarcodigo', verificarCodigo);
router.post('/reenviarcodigo', reenviarCodigoVerificacion)
router.post('/resetcontrasena', resetPassword);



export default router;
