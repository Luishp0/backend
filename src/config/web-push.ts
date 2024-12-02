import 'dotenv/config'; // Importa dotenv para cargar las variables de entorno
import webPush from 'web-push';

// Configuración de Web Push
webPush.setVapidDetails(
  'mailto:luis.hernandez.21s@utzmg.edu.mx', // Correo de contacto
  process.env.VAPID_PUBLIC_KEY || '',      // Clave pública VAPID desde .env
  process.env.VAPID_PRIVATE_KEY || ''      // Clave privada VAPID desde .env
);

export default webPush;

