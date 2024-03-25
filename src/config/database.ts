import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Pecera', {
     //mongodb://localhost:27017
     //'mongodb+srv://luishernandez21s:33116011Luis*@cluster0.0nmr178.mongodb.net/pecera?retryWrites=true&w=majority'
    });

    console.log('Conexión a MongoDB Atlas establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error);
    throw error; // Lanzar el error para manejarlo en otro lugar si es necesario
  }
};

export default connectDB;

