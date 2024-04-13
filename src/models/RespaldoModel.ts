import mongoose, { Document } from "mongoose";

export interface IRespaldo extends Document{
    fecha: Date;
    
}

const respaldoSchema = new mongoose.Schema({
    fecha: {type: Date, required: true}

})

const RespaldoModel = mongoose.model<IRespaldo>('Respaldo', respaldoSchema);

export default RespaldoModel