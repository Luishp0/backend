// src/routes/ImagenRoute.ts
import { Router } from 'express';
import { subirImagen } from '../controllers/ImagenController';
import multer from 'multer';

// Configuración de multer (puedes importarla desde index si prefieres)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagenes/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const router = Router();

// Aplica el middleware de multer a la ruta de subida de imágenes
router.post('/subir', upload.single('image'), subirImagen);

export default router;
