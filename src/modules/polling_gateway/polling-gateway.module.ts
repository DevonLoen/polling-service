import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PollingGateway } from './polling.gateway';
import { PollingModule } from '../polling/polling.module';

@Global()
@Module({
  controllers: [],
  imports: [ConfigModule, PollingModule],
  providers: [RabbitMQService, ConfigService, PollingGateway],
})
export class PollingGatewayModule {}
