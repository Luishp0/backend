"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect('mongodb+srv://luishernandez21s:33116011Luis@cluster0.mp6adf4.mongodb.net/pecera?', {
        //mongodb://localhost:27017?Pecera
        //'mongodb+srv://luishernandez21s:33116011Luis*@cluster0.0nmr178.mongodb.net/pecera?retryWrites=true&w=majority'
        //'mongodb+srv://luishernandez21s:33116011Luis@cluster0.mp6adf4.mongodb.net/pecera?'
        });
        console.log('Conexión a MongoDB Atlas establecida');
    }
    catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
        throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
    }
});
exports.default = connectDB;
