import { Socket } from 'socket.io';

export interface AuthPayload {
  id: number;
  fullname: string;
}

export interface AuthenticatedSocket extends Socket {
  user: AuthPayload;
}
