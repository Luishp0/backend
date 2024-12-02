import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import connectDB from './config/database';
import usuarioRoutes from './routes/UsuarioRoutes';
import pecesRoutes from './routes/PecesRoutes';
import sensoresRoutes from './routes/SensoresRoutes';
import aparatos from './routes/AparatosRoutes';
import respaldo from './routes/RespaldoRoutes';
import imagenRoutes from './routes/ImagenRoute';
import notificacion from './routes/NotificacionRoutes'

// Verifica que la carpeta 'imagenes/' exista
const imageDir = 'imagenes/';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}
import notificacion from './routes/NotificacionRoute'

const app = express();
const port = 8000;

app.use(cors());

// Middlewares de análisis de cuerpo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/imagenes', express.static('imagenes'));

app.use('/imagen', imagenRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/peces', pecesRoutes);
app.use('/sensores', sensoresRoutes);
app.use('/aparatos', aparatos)
app.use('/respaldo', respaldo)


connectDB()
  .then(() => {
    app.listen(port, () => {
      
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  });
