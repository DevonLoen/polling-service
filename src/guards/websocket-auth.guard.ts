// src/auth/ws-jwt.guard.ts

import { JwtPayload } from '@app/interfaces/jwt-payload.interface';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const authHeader: string = client.handshake.auth?.token as string;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('Authentication token not found or malformed.');
      client.disconnect();
      return false;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      client['user'] = payload;
      return true;
    } catch (e) {
      this.logger.error('Token validation failed:', e.message);
      client.disconnect();
      return false;
    }
  }
}
