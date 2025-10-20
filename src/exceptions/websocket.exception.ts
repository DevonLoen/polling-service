import { WsException } from '@nestjs/websockets';

export class WsNotFoundException extends WsException {
  constructor(message: string) {
    super(message);
  }
}

export class WsConflictException extends WsException {
  constructor(message: string) {
    super(message);
  }
}
