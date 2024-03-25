import { Request, Response } from 'express';
import AparatosModel, { IUser } from '../models/AparatosModel'; // Asegúrate de importar correctamente el modelo de aparatos

export const crearAparato = async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevoAparato: IUser = new AparatosModel(req.body);
  
      // Guardar el nuevo aparato en la base de datos
      const aparatoGuardado: IUser = await nuevoAparato.save();
  
      // Enviar el aparato guardado como respuesta
      res.status(201).json(aparatoGuardado);
    } catch (error: any) {
      // Manejar errores
      res.status(500).json({ error: error.message });
    }
  };

  export const visualizarAparatos = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener todos los aparatos de la base de datos
      const aparatos: IUser[] = await AparatosModel.find();
  
      // Enviar la lista de aparatos como respuesta
      res.json(aparatos);
    } catch (error: any) {
      // Manejar errores
      res.status(500).json({ error: error.message });
    }
  };

  export const visualizarAparatoPorId = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener el ID del aparato desde los parámetros de la solicitud
      const id = req.params.id;
  
      // Buscar el aparato por ID en la base de datos
      const aparato: IUser | null = await AparatosModel.findById(id);
  
      // Verificar si se encontró el aparato
      if (!aparato) {
         res.status(404).json({ mensaje: 'Aparato no encontrado' });
      }
  
      // Enviar el aparato encontrado como respuesta
      res.json(aparato);
    } catch (error: any) {
      // Manejar errores
      res.status(500).json({ error: error.message });
    }
  };

  export const actualizarAparato = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener el ID del aparato desde los parámetros de la solicitud
      const id = req.params.id;
  
      // Buscar el aparato por ID y actualizarlo en la base de datos
      const aparatoActualizado: IUser | null = await AparatosModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
  
      // Verificar si se encontró el aparato
      if (!aparatoActualizado) {
         res.status(404).json({ mensaje: 'Aparato no encontrado' });
      }
  
      // Enviar el aparato actualizado como respuesta
      res.json(aparatoActualizado);
    } catch (error: any) {
      // Manejar errores
      res.status(500).json({ error: error.message });
    }
  };

  export const eliminarAparato = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener el ID del aparato desde los parámetros de la solicitud
      const id = req.params.id;
  
      // Buscar el aparato por ID y eliminarlo de la base de datos
      const aparatoEliminado: IUser | null = await AparatosModel.findByIdAndDelete(id);
  
      // Verificar si se encontró el aparato
      if (!aparatoEliminado) {
         res.status(404).json({ mensaje: 'Aparato no encontrado' });
      }
  
      // Enviar el aparato eliminado como respuesta
      res.json({ mensaje: 'Aparato eliminado correctamente', aparato: aparatoEliminado });
    } catch (error: any) {
      // Manejar errores
      res.status(500).json({ error: error.message });
    }
  };


export const visualizarAparatosPorNombre = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el nombre del aparato desde los parámetros de la solicitud
    const nombreAparato = req.params.nombre;

    // Buscar aparatos por su nombre en la base de datos
    const aparatos: IUser[] = await AparatosModel.find({ nombre: nombreAparato });

    // Verificar si se encontraron aparatos
    if (aparatos.length === 0) {
       res.status(404).json({ mensaje: 'No se encontraron aparatos con ese nombre' });
    }

    // Enviar los aparatos encontrados como respuesta
    res.json(aparatos);
  } catch (error: any) {
    // Manejar errores
    res.status(500).json({ error: error.message });
  }
};

export const visualizarAparatosPorRango = async (req: Request, res: Response): Promise<void> => {
    try {
      // Obtener los valores mínimos y máximos desde los parámetros de la solicitud
      const minimo = req.query.minimo as string;
      const maximo = req.query.maximo as string;
  
      // Verificar si se proporcionaron valores mínimos y máximos
      if (!minimo || !maximo) {
         res.status(400).json({ mensaje: 'Los valores mínimo y máximo son requeridos' });
      }
  
      // Buscar aparatos por rango mínimo y máximo en la base de datos
      const aparatos: IUser[] = await AparatosModel.find({
        minimo: { $gte: minimo },
        maximo: { $lte: maximo },
      });
  
      // Verificar si se encontraron aparatos
      if (aparatos.length === 0) {
         res.status(404).json({ mensaje: 'No se encontraron aparatos en el rango especificado' });
      }
  
      // Enviar los aparatos encontrados como respuesta
      res.json(aparatos);
    } catch (error: any) {
      // Manejar errores
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
            _id: null,
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
      }
  
      res.json(estadisticas[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };