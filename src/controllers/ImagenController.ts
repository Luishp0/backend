// src/controllers/ImagenController.ts
import { Request, Response } from 'express';

export const subirImagen = async (req: Request, res: Response): Promise<void> => {
  console.log('Archivo recibido:', req.file);
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se subió ningún archivo' });
      return;
    }

    const imagePath = req.file.path; // Ruta de la imagen guardada
    res.status(200).json({ message: 'Imagen subida exitosamente', filePath: imagePath });
  } catch (error: any) {
    console.error('Error al subir la imagen:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al subir la imagen' });
  }
};
