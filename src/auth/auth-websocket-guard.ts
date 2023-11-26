import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WebTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    WebTokenGuard.verifyToken(client);
    return true;
  }

  static verifyToken = (client: Socket) => {
    const { authorization } = client.handshake.headers;
    const token: string = authorization?.split(' ')[1] ?? '';
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = verify(token, jwtConstants.secret);
    return payload;
  };
}
