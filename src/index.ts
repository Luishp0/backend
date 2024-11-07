import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';  
import connectDB from "./config/database"
import usuarioRoutes from './routes/UsuarioRoutes';
import pecesRoutes from './routes/PecesRoutes';
import sensoresRoutes from './routes/SensoresRoutes';
import aparatos from './routes/AparatosRoutes'
import respaldo from './routes/RespaldoRoutes'
import notificacion from './routes/NotificacionRoute'

const app = express();
const port = 8000;

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(cors());
app.use(express.json());
app.use('/usuario', usuarioRoutes);
app.use('/peces', pecesRoutes);
app.use('/sensores', sensoresRoutes);
app.use('/aparatos', aparatos)
app.use('/respaldo', respaldo)
app.use('/notificacion', notificacion);


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1); // Salir del proceso con error
  });
