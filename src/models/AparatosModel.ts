import mongoose, { Document } from "mongoose";

export interface IUser extends Document{
    nombre: String;
    minimo: Number; 
    maximo: Number;
    estado: Boolean;
}

const aparatosSchema = new mongoose.Schema({
    nombre: {type: String, required: true },
    minimo: {type: Number, requied: true },
    maximo: {type: Number, required: true},
    estado: {type: Boolean, required: true}
});

const AparatosModel = mongoose.model<IUser>('aparatos', aparatosSchema)

export default AparatosModel;