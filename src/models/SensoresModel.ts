import mongoose from 'mongoose';

export interface ISensor extends mongoose.Document {
  tipo: string;
  unidadMedida: string;
  valorNumerico: Number;
  
}

const sensorSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  unidadMedida: {type: String, required: true},
  valorNumerico: { type: Number, required: true }
  
});

const SensoresModel = mongoose.model<ISensor>('Sensor', sensorSchema, 'sensores');

export default SensoresModel;
