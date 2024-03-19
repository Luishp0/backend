import express from 'express';
import { crearUsuario } from '../controllers/UsuarioController';

const router = express.Router();

router.post('/', crearUsuario);


export default router;
