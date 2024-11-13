"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AparatosController_1 = require("../controllers/AparatosController"); // Asegúrate de importar los controladores correctos
const router = (0, express_1.Router)();
router.post('/', AparatosController_1.crearAparato);
router.get('/', AparatosController_1.visualizarAparatos);
router.get('/ver/:id', AparatosController_1.visualizarAparatoPorId);
router.put('/:id', AparatosController_1.actualizarAparato);
router.delete('/:id', AparatosController_1.eliminarAparato);
router.get('/buscar', AparatosController_1.buscarAparatos);
router.get('/estadisticas', AparatosController_1.obtenerEstadisticasAparatos);
router.get('/activo-inactivo', AparatosController_1.obtenerDatosGraficaAparatos);
router.get('/rango', AparatosController_1.visualizarAparatosPorRango);
router.get('/:nombre', AparatosController_1.visualizarAparatosPorNombre);
exports.default = router;
