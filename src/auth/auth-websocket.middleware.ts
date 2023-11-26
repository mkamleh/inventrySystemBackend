import { WebTokenGuard } from './auth-websocket-guard';

export const SocketAuthMiddleWear = () => {
  return (client, next) => {
    try {
      WebTokenGuard.verifyToken(client);
      next();
    } catch (error) {
      next(error);
    }
  };
};
