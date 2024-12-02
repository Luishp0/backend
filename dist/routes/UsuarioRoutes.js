"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UsuarioController_1 = require("../controllers/UsuarioController");
const RestablecerContrasenaController_1 = require("../controllers/RestablecerContrasenaController");
const router = express_1.default.Router();
router.post('/', UsuarioController_1.crearUsuario);
router.get('/', UsuarioController_1.visualizarUsuarios);
router.get('/contador', UsuarioController_1.contarUsuarios);
router.get('/:nombre', UsuarioController_1.visualizarUsuarioPorNombre);
router.put('/:id', UsuarioController_1.actualizarUsuario);
router.delete('/:id', UsuarioController_1.eliminarUsuario);
router.post('/enviarcorreo', RestablecerContrasenaController_1.enviarCorreoRecuperacion);
router.post('/login', UsuarioController_1.loginUser);
router.post('/verificarcodigo', RestablecerContrasenaController_1.verificarCodigo);
router.post('/reenviarcodigo', RestablecerContrasenaController_1.reenviarCodigoVerificacion);
router.post('/resetcontrasena', RestablecerContrasenaController_1.resetPassword);
exports.default = router;