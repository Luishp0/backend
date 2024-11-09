// src/controllers/ImagenController.ts
import { Request, Response } from 'express';

export const subirImagen = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No se subió ningún archivo' });
            return;
        }

        const imagePath = req.file.path; // Ruta relativa de la imagen
        const host = req.hostname === 'localhost' ? '192.168.1.5' : req.hostname; // Usar IP si es localhost
        const port = process.env.PORT || 8000; // Asegúrate de tener el puerto correcto
        const imageUrl = `${req.protocol}://${host}:${port}/${imagePath.replace(/\\/g, '/')}`; // URL absoluta

        console.log('URL Absoluta de la imagen:', imageUrl); // Para depuración

        // Devolver la URL absoluta en la respuesta
        res.status(200).json({ message: 'Imagen subida exitosamente', filePath: imageUrl });
    } catch (error: any) {
        console.error('Error al subir la imagen:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al subir la imagen' });
    }
};
