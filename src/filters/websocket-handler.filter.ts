import { WsValidationException } from '@app/exceptions/validation.exception';
import {
  WsConflictException,
  WsGoneException,
  WsNotFoundException,
} from '@app/exceptions/websocket.exception';
import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionsHandlerFilter extends BaseWsExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    if (exception instanceof WsException) {
      const error = exception.getError();
      const message = typeof error === 'string' ? error : exception.message;
      this.logger.error(
        `WsException Error: ${exception.message}`,
        exception.stack,
      );
      switch (exception.constructor) {
        case WsValidationException:
          this.sendErrorResponse(client, HttpStatus.BAD_REQUEST, message); // 400
          break;

        case WsNotFoundException:
          this.sendErrorResponse(client, HttpStatus.NOT_FOUND, message); // 404
          break;

        case WsConflictException:
          this.sendErrorResponse(client, HttpStatus.CONFLICT, message); // 409
          break;

        case WsGoneException:
          this.sendErrorResponse(client, HttpStatus.GONE, message); // 410
          break;

        default:
          this.sendErrorResponse(client, HttpStatus.BAD_REQUEST, message); // 400
          break;
      }
      return;
    }

    if (exception instanceof HttpException) {
      this.logger.error(
        `Wrong Exception Error: ${exception.message}`,
        exception.stack,
      );
      const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = exception.message;
      this.sendErrorResponse(client, httpStatus, message);
      return;
    }

    if (exception instanceof Error) {
      this.logger.error(
        `Internal Server Error: ${exception.message}`,
        exception.stack,
      );
      this.sendErrorResponse(
        client,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'An unexpected error occurred.',
      );
    }
  }
  private readonly logger = new Logger(WsExceptionsHandlerFilter.name);

  private sendErrorResponse(
    client: Socket,
    httpStatus: number,
    message: string,
  ) {
    client.emit('exception', {
      status: 'error',
      httpStatus,
      message,
    });
  }
}
