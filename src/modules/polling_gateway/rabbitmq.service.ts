import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import amqp, {
  AmqpConnectionManager,
  ChannelWrapper,
} from 'amqp-connection-manager';
import { Channel, ConsumeMessage } from 'amqplib';
@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private exchangeName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing RabbitMQ producer...');
    const amqpUrl = this.configService.get<string>('RABBITMQ_URL');
    this.exchangeName = this.configService.get<string>(
      'RABBITMQ_ORDER_EXCHANGE',
    );
    if (!amqpUrl || !this.exchangeName) {
      this.logger.error('RabbitMQ URL or Exchange Name is not configured.');
      return;
    }

    this.connection = amqp.connect([amqpUrl]);

    this.connection.on('connect', () => {
      this.logger.log('✅ RabbitMQ Producer Connected!');
    });
    this.connection.on('disconnect', (err) => {
      this.logger.error('RabbitMQ Producer Disconnected.', err);
    });

    this.channelWrapper = this.connection.createChannel({
      setup: async (channel: Channel) => {
        this.logger.log('Setting up RabbitMQ channel and exchange...');
        await channel.assertExchange(this.exchangeName, 'fanout', {
          durable: true,
        });
        this.logger.log('✅ Exchange is ready');
      },
    });
    await this.channelWrapper.addSetup(async (channel: Channel) => {
      const q = await channel.assertQueue('', {
        exclusive: true,
      });
      await channel.bindQueue(q.queue, this.exchangeName, '');
      await channel.consume(q.queue, (data: ConsumeMessage) => {
        this.eventEmitter.emit(
          'message.received',
          JSON.parse(Buffer.from(data.content).toString()),
        );
      });
    });
  }

  async sendMessage<T>(message: T): Promise<void> {
    if (!this.channelWrapper) {
      this.logger.error(
        'RabbitMQ channel wrapper is not available. Message not sent.',
      );
      return;
    }

    try {
      this.logger.log(`Sent message to exchange '${this.exchangeName}'`);
      await this.channelWrapper.publish(
        this.exchangeName,
        '',
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );
      this.logger.log(
        `Successfully Sent message to exchange '${this.exchangeName}'`,
      );
    } catch (error) {
      this.logger.error('Failed to send message', error);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Closing RabbitMQ producer connection...');
    if (this.connection) {
      await this.connection.close();
    }
  }
}
