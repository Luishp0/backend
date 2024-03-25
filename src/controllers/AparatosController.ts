import { Request, Response } from 'express';
import AparatosModel, { IUser } from '../models/AparatosModel'; // Asegúrate de importar correctamente el modelo de aparatos

export const crearAparato = async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevoAparato: IUser = new AparatosModel(req.body);
      const aparatoGuardado: IUser = await nuevoAparato.save();
      res.status(201).json(aparatoGuardado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const visualizarAparatos = async (req: Request, res: Response): Promise<void> => {
    try {
      const aparatos: IUser[] = await AparatosModel.find();
      res.json(aparatos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const visualizarAparatoPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const aparato: IUser | null = await AparatosModel.findById(id);
      if (!aparato) {
        res.status(404).json({ mensaje: 'Aparato no encontrado' });
        return;
      }
      res.json(aparato);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const actualizarAparato = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const aparatoActualizado: IUser | null = await AparatosModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!aparatoActualizado) {
        res.status(404).json({ mensaje: 'Aparato no encontrado' });
        return;
      }
      res.json(aparatoActualizado);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const eliminarAparato = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const aparatoEliminado: IUser | null = await AparatosModel.findByIdAndDelete(id);
      if (!aparatoEliminado) {
        res.status(404).json({ mensaje: 'Aparato no encontrado' });
        return;
      }
      res.json({ mensaje: 'Aparato eliminado correctamente', aparato: aparatoEliminado });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const visualizarAparatosPorNombre = async (req: Request, res: Response): Promise<void> => {
    try {
      const nombreAparato = req.params.nombre;
      const aparatos: IUser[] = await AparatosModel.find({ nombre: nombreAparato });
      if (aparatos.length === 0) {
        res.status(404).json({ mensaje: 'No se encontraron aparatos con ese nombre' });
        return;
      }
      res.json(aparatos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const visualizarAparatosPorRango = async (req: Request, res: Response): Promise<void> => {
    try {
      const minimo = req.query.minimo as string;
      const maximo = req.query.maximo as string;
      if (!minimo || !maximo) {
        res.status(400).json({ mensaje: 'Los valores mínimo y máximo son requeridos' });
        return;
      }
      const aparatos: IUser[] = await AparatosModel.find({
        minimo: { $gte: minimo },
        maximo: { $lte: maximo },
      });
      if (aparatos.length === 0) {
        res.status(404).json({ mensaje: 'No se encontraron aparatos en el rango especificado' });
        return;
      }
      res.json(aparatos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const obtenerDatosGraficaAparatos = async (req: Request, res: Response): Promise<void> => {
    try {
      const datos = await AparatosModel.aggregate([
        {
          $group: {
            _id: '$nombre',
            estadoActivo: { $sum: { $cond: ['$estado', 1, 0] } },
            estadoInactivo: { $sum: { $cond: ['$estado', 0, 1] } },
          },
        },
      ]);
      if (datos.length === 0) {
        res.status(404).json({ mensaje: 'No se encontraron datos para la gráfica' });
        return;
      }
      res.json(datos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  export const buscarAparatos = async (req: Request, res: Response): Promise<void> => {
    try {
      const { minimo, maximo, estado } = req.query;
  
      const query: any = {};
  
      if (minimo) query.minimo = { $gte: minimo };
      if (maximo) query.maximo = { $lte: maximo };
      if (estado) query.estado = estado === 'true';
  
      const aparatos: IUser[] = await AparatosModel.find(query);
  
      if (aparatos.length === 0) {
         res.status(404).json({ mensaje: 'No se encontraron aparatos con los filtros proporcionados' });
         return;
      }
  
      res.json(aparatos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  export const obtenerEstadisticasAparatos = async (req: Request, res: Response): Promise<void> => {
    try {
      const estadisticas = await AparatosModel.aggregate([
        {
          $group: {
            _id: '$nombre', // Agrupar por nombre del aparato
            minimoMin: { $min: '$minimo' },
            maximoMax: { $max: '$maximo' },
            estadoActivo: { $sum: { $cond: ['$estado', 1, 0] } },
            estadoInactivo: { $sum: { $cond: ['$estado', 0, 1] } },
            total: { $sum: 1 },
          },
        },
      ]);
  
      if (estadisticas.length === 0) {
         res.status(404).json({ mensaje: 'No se encontraron estadísticas' });
         return;
      }
  
      res.json(estadisticas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };