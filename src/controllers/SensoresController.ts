import { Request, Response } from 'express';
import SensorModel, { ISensor } from '../models/SensoresModel'; // Importar el modelo de sensores

// Controlador para crear un nuevo sensor
export const crearSensor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tipo, unidadMedida, valorNumerico } = req.body;

    // Crear un nuevo documento de sensor con los datos proporcionados
    const nuevoSensor: ISensor = new SensorModel({
      tipo,
      unidadMedida,
      valorNumerico
    });

    // Guardar el nuevo sensor en la base de datos
    await nuevoSensor.save();

    res.json({ message: 'Sensor creado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener todos los sensores
export const obtenerSensores = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener todos los sensores de la base de datos
    const sensores: ISensor[] = await SensorModel.find();

    res.json(sensores);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para obtener un sensor por su ID
export const obtenerSensorPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Buscar un sensor por su ID en la base de datos
    const sensor: ISensor | null = await SensorModel.findById(id);

    if (!sensor) {
      res.status(404).json({ message: 'Sensor no encontrado' });
      return;
    }

    res.json(sensor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para actualizar un sensor por su ID
export const actualizarSensor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { tipo, unidadMedida } = req.body;

    // Verificar si el sensor existe
    const sensorExistente: ISensor | null = await SensorModel.findById(id);
    if (!sensorExistente) {
      res.status(404).json({ message: 'Sensor no encontrado' });
      return;
    }

    // Actualizar los datos del sensor
    sensorExistente.tipo = tipo;
    sensorExistente.unidadMedida = unidadMedida;

    // Guardar los cambios en la base de datos
    await sensorExistente.save();

    res.json({ message: 'Sensor actualizado correctamente', sensor: sensorExistente });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para eliminar un sensor por su ID
export const eliminarSensor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar si el sensor existe
    const sensorExistente: ISensor | null = await SensorModel.findById(id);
    if (!sensorExistente) {
      res.status(404).json({ message: 'Sensor no encontrado' });
      return;
    }

    // Eliminar el sensor de la base de datos
    await SensorModel.findByIdAndDelete(id);

    res.json({ message: 'Sensor eliminado correctamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Controlador para contar todos los sensores
export const contarSensores = async (req: Request, res: Response): Promise<void> => {
  try {
    // Contar todos los sensores en la base de datos
    const totalSensores: number = await SensorModel.countDocuments();

    // Enviar el número total de sensores como respuesta
    res.json({ totalSensores });
  } catch (error: any) {
    // Manejar errores
    res.status(500).json({ error: error.message });
  }
};


