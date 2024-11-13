"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subirImagen = void 0;
const subirImagen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        console.error('Error al subir la imagen:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al subir la imagen' });
    }
});
exports.subirImagen = subirImagen;
