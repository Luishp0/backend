import mongoose, { Document } from 'mongoose';

// Interfaz para un aparato
export interface IAparato extends Document {
  id_usuario: mongoose.Types.ObjectId; // Relación con el usuario
  nombre: string;                     // Nombre del aparato
  minimo: number;                     // Valor mínimo aceptable
  maximo: number;                     // Valor máximo aceptable
  estado: boolean;                    // Estado del aparato (activo/inactivo)
}

// Esquema de aparatos
const aparatosSchema = new mongoose.Schema<IAparato>({
  id_usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true },
  nombre: { type: String, required: true },
  minimo: { type: Number, required: true },
  maximo: { type: Number, required: true },
  estado: { type: Boolean, required: true },
});

const AparatosModel = mongoose.model<IAparato>('aparatos', aparatosSchema);

export default AparatosModel;
