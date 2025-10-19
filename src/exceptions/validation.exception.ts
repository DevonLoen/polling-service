import { WsException } from '@nestjs/websockets';
export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class WsValidationException extends WsException {
  constructor(message: string) {
    super(message);
  }
}
