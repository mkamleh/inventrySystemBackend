import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthMiddleWear } from 'src/auth/auth-websocket.middleware';

@WebSocketGateway({ namespace: 'test', cors: true })
export class EventGateway {
  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleWear() as any);
  }
  // @SubscribeMessage('test')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello worldddd!';
  // }

  sendMessage(msg: any) {
    this.server.emit('test', msg);
  }
}
