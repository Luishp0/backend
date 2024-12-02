import { Request, Response } from 'express';
import UsuarioModel, { IUser } from '../models/UsuarioModel';  // Importa el modelo de usuario
import UserModel from '../models/UsuarioModel'; // Ajusta el path al modelo
import webPush from '../config/web-push'; // Ajusta el path a tu configuración de web-push

// Enviar notificación a una suscripción específica (basada en uno o más usuarios)
export const sendNotificationToUsers = async (req: Request, res: Response) => {
    const { userIds, payload } = req.body;
  
    try {
      // Validar si se recibieron los 'userIds'
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'Se deben proporcionar uno o más userIds' });
      }
  
      // Buscar todos los usuarios con los IDs proporcionados
      const users = await UserModel.find({ _id: { $in: userIds } });
  
      // Verificar si existen usuarios con suscripciones
      if (users.length === 0) {
        return res.status(404).json({ error: 'Ningún usuario encontrado con las suscripciones' });
      }
  
      // Enviar la notificación a cada usuario
      const notificaciones = users.map(user => {
        if (user.subscription) {
          const pushSubscription = {
            endpoint: user.subscription.endpoint,
            keys: user.subscription.keys,
          };
  
          // Enviar la notificación
          return webPush.sendNotification(pushSubscription, JSON.stringify(payload)).catch(err => {
            if (err instanceof Error) {
              console.error('Error enviando notificación a:', user._id, err.message);
            } else {
              console.error('Error desconocido enviando notificación a:', user._id, err);
            }
          });
        } else {
          console.log('Usuario sin suscripción:', user._id);
          return Promise.resolve(); // Asegurar que el array de promesas tenga un valor para usuarios sin suscripción
        }
      });
  
      // Esperar a que todas las notificaciones se envíen
      await Promise.all(notificaciones);
  
      // Responder cuando todas las notificaciones han sido enviadas
      res.json({ message: 'Notificaciones enviadas a los usuarios seleccionados' });
  
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error al enviar notificaciones:', err.message);
        res.status(500).json({ error: err.message });
      } else {
        console.error('Error desconocido al enviar notificaciones:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  };
  

// Enviar notificaciones a todas las suscripciones activas
export const sendNotificationToAll = async (req: Request, res: Response) => {
    const payload = JSON.stringify(req.body.payload);
  
    try {
      // Obtener todos los usuarios con suscripciones activas
      const users = await UserModel.find({ 'subscription.endpoint': { $exists: true } });
  
      const notificaciones = users.map(user => {
        if (user.subscription) {
          const pushSubscription = {
            endpoint: user.subscription.endpoint,
            keys: user.subscription.keys,
          };
  
          // Enviar la notificación
          return webPush.sendNotification(pushSubscription, payload).catch(err => {
            console.error('Error enviando notificación a:', user._id, err);
          });
        }
      });
  
      await Promise.all(notificaciones);
  
      res.json({ message: 'Notificaciones enviadas a todas las suscripciones activas' });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error desconocido' });
      }
    }
  };
  

  // Guardar o actualizar una suscripción para un usuario
  export const saveOrUpdateSubscription = async (req: Request, res: Response) => {
    try {
      const { userId, subscription } = req.body;
  
      // Validar que se recibió el objeto de suscripción correctamente
      if (!subscription || !subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
        return res.status(400).json({ error: 'Faltan campos necesarios en la suscripción' });
      }
  
      // Buscar al usuario por su ID
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Actualizar la suscripción del usuario
      user.subscription = subscription;
      await user.save();
  
      // Payload para la notificación
      const payload = {
        title: 'Notificaciones activadas',
        body: 'Gracias por suscribirte',
      };
  
      // Verificar que la suscripción existe antes de enviar la notificación
      if (user.subscription) {
        const pushSubscription = {
          endpoint: user.subscription.endpoint,
          keys: user.subscription.keys,
        };
  
        await webPush.sendNotification(pushSubscription, JSON.stringify(payload));
      }
  
      res.status(201).json({ message: 'Suscripción guardada y notificación enviada exitosamente' });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  };
  