import mongoose, { Document } from "mongoose";

export interface IUser extends Document{
    nombre: String;
    minimo: String; 
    maximo: String;
    estado: Boolean;
}

const aparatosSchema = new mongoose.Schema({
    nombre: {type: Number, required: true },
    minimo: {type: String, requied: true },
    maximo: {type: String, required: true},
    estado: {type: Boolean, required: true}
});

const AparatosModel = mongoose.model<IUser>('aparatos', aparatosSchema)

export default AparatosModel;