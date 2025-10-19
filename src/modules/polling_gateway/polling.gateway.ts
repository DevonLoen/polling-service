import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseFilters } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RabbitMQService } from './rabbitmq.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SubmitPollingDto } from './dtos/submit-polling.dto';
import { getClassSchema } from 'joi-class-decorators';
import { WsExceptionsHandlerFilter } from '@app/filters/websocket-handler.filter';
import { WsValidationException } from '@app/exceptions/validation.exception';
import { PollingService } from '../polling/services/polling.service';

@WebSocketGateway({ cors: { origin: '*' } })
@UseFilters(WsExceptionsHandlerFilter)
export class PollingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly pollingService: PollingService,
  ) {}

  private logger: Logger = new Logger('ChatGateway');

  handleConnection(client: Socket) {
    this.logger.log(`🟢 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔴 Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('polling:join')
  async handleJoinRoom(
    @MessageBody() roomCode: string,
    @ConnectedSocket() clientSocket: Socket,
  ) {
    await clientSocket.join(roomCode);

    this.logger.log(`Client ${clientSocket.id} joined room: ${roomCode}`);

    clientSocket.emit(
      'joinedSuccessfully',
      `Anda berhasil bergabung ke room ${roomCode}`,
    );
  }

  @SubscribeMessage('polling:submit')
  handleMessageRoom(
    @MessageBody() data: SubmitPollingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const validated = getClassSchema(SubmitPollingDto).validate(data);
    if (validated.error) {
      throw new WsValidationException(validated.error.details[0].message);
    }

    this.logger.log(
      `Pesan ke room ${data.room} dari ${client.id}: ${data.polling_id}`,
    );

    this.rabbitMQService.sendMessage({ ...data, id: client.id });
  }

  @OnEvent('message.received')
  handleBrokerMessage(payload: SubmitPollingDto & { id: string }) {
    this.server.to(payload.room).emit('pesanDariRoom', {
      senderId: payload.id,
      message: payload.polling_id,
    });
  }
}
