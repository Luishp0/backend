import express from 'express';
import mongoose from 'mongoose';
import connectDB from "./config/database"
import usuarioRoutes from './routes/UsuarioRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/usuario', usuarioRoutes);


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
