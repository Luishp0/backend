"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PecesController_1 = require("../controllers/PecesController");
const router = express_1.default.Router();
router.post('/', PecesController_1.crearPez);
router.get('/', PecesController_1.obtenerPeces);
router.get('/contador', PecesController_1.contarPeces);
router.get('/:idUsuario', PecesController_1.obtenerPecesDeUsuario);
router.get('/:id', PecesController_1.obtenerPezPorId);
router.put('/:id', PecesController_1.actualizarPez);
router.delete('/:id', PecesController_1.eliminarPez);
exports.default = router;
