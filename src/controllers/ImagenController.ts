// src/controllers/ImagenController.ts
import { Request, Response } from 'express';

// controllers/ImagenController.ts
export const subirImagen = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No se subió ningún archivo' });
        return;
      }
  
      const imagePath = req.file.path;
      res.status(200).json({ message: 'Imagen subida exitosamente', filePath: imagePath });
    } catch (error: any) {
      console.error('Error al subir la imagen:', error.message);
      res.status(500).json({ error: 'Error interno del servidor al subir la imagen' });
    }
  };
  
