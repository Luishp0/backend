import mongoose, { Document } from 'mongoose';

// Definir la interfaz para los documentos de peces
export interface IPez extends Document {
  nombre: string;
  tipo: string;
  descripcion: string;
  parametros: {
    nombre: string;
    valorSugerido: number;
  };
  alimentacion: {
    alimento: string;
    cantidad: number;
    frecuencia: string;
  };
  idUsuario: string;
}

// Definir el esquema de la colección de peces
const pezSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  descripcion: { type: String, required: true },
  parametros: {
    nombre: { type: String, required: true },
    valorSugerido: { type: Number, required: true }
  },
  alimentacion: {
    alimento: { type: String, required: true },
    cantidad: { type: String, required: true },
    frecuencia: { type: String, required: true }
  },
  idUsuario: { type: String, required: true }
});

// Crear el modelo de Mongoose para la colección de peces
const PezModel = mongoose.model<IPez>('Peces', pezSchema, 'peces');

export default PezModel;
