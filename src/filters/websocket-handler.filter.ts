import { WsValidationException } from '@app/exceptions/validation.exception';
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionsHandlerFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const error = exception.getError();

    switch (true) {
      case exception instanceof WsValidationException:
        client.emit('exception', {
          httpStatus: 400,
          message: typeof error === 'string' ? error : '',
        });
        break;
      default:
        client.emit('exception', {
          httpStatus: 500,
          message: typeof error === 'string' ? error : '',
        });
    }
  }
}
