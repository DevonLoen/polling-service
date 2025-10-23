import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RabbitMQService } from './rabbitmq.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SubmitPollingDto } from './dtos/submit-polling.dto';
import { getClassSchema } from 'joi-class-decorators';
import { WsExceptionsHandlerFilter } from '@app/filters/websocket-handler.filter';
import { WsValidationException } from '@app/exceptions/validation.exception';
import { PollingService } from '../polling/services/polling.service';
import { UserPollingService } from '../user-polling/services/user-polling.service';
import { CreateUserPollingDto } from '../user-polling/dtos/create-user-polling.dto';
import { WsNotFoundException } from '@app/exceptions/websocket.exception';
import { WsJwtGuard } from '@app/guards/websocket-auth.guard';
import { AuthenticatedSocket } from '@app/interfaces/authenticated-socket.interface';

@WebSocketGateway({ cors: { origin: '*' } })
@UseFilters(WsExceptionsHandlerFilter)
@UseGuards(WsJwtGuard)
export class PollingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly pollingService: PollingService,
    private readonly userPollingService: UserPollingService,
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
    const pollingData =
      await this.pollingService.getPollingVoteDataByCode(roomCode);
    if (pollingData.length === 0) {
      throw new WsNotFoundException('Room Code Not Found');
    }
    await clientSocket.join(roomCode);

    this.logger.log(`Client ${clientSocket.id} joined room: ${roomCode}`);

    clientSocket.emit('polling:room', pollingData);
  }

  @SubscribeMessage('polling:submit')
  async handleMessageRoom(
    @MessageBody() data: SubmitPollingDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const validated = getClassSchema(SubmitPollingDto).validate(data);
    if (validated.error) {
      throw new WsValidationException(validated.error.details[0].message);
    }
    const createUserPollingDto = new CreateUserPollingDto();
    createUserPollingDto.pollingOptionId = data.pollingOptionId;

    await this.userPollingService.createUserPolling(
      data.room,
      createUserPollingDto,
      client.user.id,
    );
    this.logger.log(
      `Submit Polling ke room ${data.room} dari ${client.id} dengan optionId: ${data.pollingOptionId}`,
    );

    this.rabbitMQService.sendMessage({ ...data, id: client.id });
  }

  @OnEvent('message.received')
  async handleBrokerMessage(payload: SubmitPollingDto & { id: string }) {
    const pollingData = await this.pollingService.getPollingVoteDataByCode(
      payload.room,
    );
    if (pollingData.length === 0) {
      throw new WsNotFoundException('Room Code Not Found');
    }
    this.server.to(payload.room).emit('polling:room', pollingData);
  }
}
