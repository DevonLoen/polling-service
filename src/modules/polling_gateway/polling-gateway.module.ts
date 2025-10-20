import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PollingGateway } from './polling.gateway';
import { PollingModule } from '../polling/polling.module';
import { UserPollingModule } from '../user-polling/user-polling.module';

@Global()
@Module({
  controllers: [],
  imports: [ConfigModule, PollingModule, UserPollingModule],
  providers: [RabbitMQService, ConfigService, PollingGateway],
})
export class PollingGatewayModule {}
