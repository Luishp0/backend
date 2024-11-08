// routes/ImagenRoute.ts
import { Router } from 'express';
import multer from 'multer';
import { subirImagen } from '../controllers/ImagenController';

// Configuración de multer con verificación de tipo de archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagenes/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Verifica si el archivo es una imagen
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Acepta el archivo
  } else {
    cb(new Error('Solo se permiten archivos de imagen')); // Rechaza el archivo con un error
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// Crea la instancia de Router y define la ruta
const router = Router();

// Aplica el middleware de multer a la ruta específica
router.post('/subir', upload.single('image'), subirImagen);

export default router;
