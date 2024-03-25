// controllers/PezController.ts

import { Request, Response } from 'express';
import PezModel, { IPez } from '../models/PecesModel'; // Importar el modelo de peces

// Controlador para crear un nuevo pez
export const crearPez = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, tipo, descripcion, parametros, alimentacion, idUsuario } = req.body;

    // Crear un nuevo documento de pez con los datos proporcionados
    const nuevoPez: IPez = new PezModel({
      nombre,
      tipo,
      descripcion,
      parametros,
      alimentacion,
      idUsuario
    });

    // Guardar el nuevo pez en la base de datos
    await nuevoPez.save();

    res.json({ message: 'Pez creado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener todos los peces
export const obtenerPeces = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener todos los peces de la base de datos
    const peces: IPez[] = await PezModel.find();

    res.json(peces);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener un pez por su ID
export const obtenerPezPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Buscar un pez por su ID en la base de datos
    const pez: IPez | null = await PezModel.findById(id);

    if (!pez) {
      res.status(404).json({ message: 'Pez no encontrado' });
      return;
    }

    res.json(pez);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para actualizar un pez por su ID
export const actualizarPez = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, tipo, descripcion, parametros, alimentacion, idUsuario } = req.body;

    // Verificar si el pez existe
    const pezExistente: IPez | null = await PezModel.findById(id);
    if (!pezExistente) {
      res.status(404).json({ message: 'Pez no encontrado' });
      return;
    }

    // Actualizar los datos del pez
    pezExistente.nombre = nombre;
    pezExistente.tipo = tipo;
    pezExistente.descripcion = descripcion;
    pezExistente.parametros = parametros;
    pezExistente.alimentacion = alimentacion;
    pezExistente.idUsuario = idUsuario;

    // Guardar los cambios en la base de datos
    await pezExistente.save();

    res.json({ message: 'Pez actualizado correctamente', pez: pezExistente });
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para eliminar un pez por su ID
export const eliminarPez = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar si el pez existe
    const pezExistente: IPez | null = await PezModel.findById(id);
    if (!pezExistente) {
      res.status(404).json({ message: 'Pez no encontrado' });
      return;
    }

    // Eliminar el pez de la base de datos
    await PezModel.findByIdAndDelete(id);

    res.json({ message: 'Pez eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener todos los peces asociados a un usuario
export const obtenerPecesDeUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
      const { idUsuario } = req.params;
  
      // Buscar todos los peces asociados al usuario en la base de datos
      const peces: IPez[] = await PezModel.find({ idUsuario });
  
      res.json(peces);
    } catch (error : any) {
      res.status(500).json({ error: error.message });
    }
  };
  