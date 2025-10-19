import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PollingGateway } from './polling.gateway';

@Global()
@Module({
  controllers: [],
  imports: [ConfigModule],
  providers: [RabbitMQService, ConfigService, PollingGateway],
})
export class PollingGatewayModule {}
