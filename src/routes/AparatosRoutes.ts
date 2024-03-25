import { Router } from 'express';
import { crearAparato,
    visualizarAparatos,
    visualizarAparatoPorId,
    actualizarAparato,
    eliminarAparato,
    buscarAparatos,
    obtenerEstadisticasAparatos,
    obtenerDatosGraficaAparatos,
    visualizarAparatosPorNombre, 
    visualizarAparatosPorRango } from '../controllers/AparatosController'; // Asegúrate de importar los controladores correctos

const router = Router();

router.post('/', crearAparato);
router.get('/', visualizarAparatos);
router.get('/:id', visualizarAparatoPorId);
router.put('/:id', actualizarAparato);
router.delete('/:id', eliminarAparato);
router.get('/buscar', buscarAparatos);
router.get('/estadisticas', obtenerEstadisticasAparatos);
router.get('/datos-grafica', obtenerDatosGraficaAparatos);

router.get('/nombre/:nombre', visualizarAparatosPorNombre);
router.get('/rango', visualizarAparatosPorRango);

export default router;
