import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataValidationPipe } from './pipes/validation.pipe';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ExceptionHandlerFilter } from './filters/exception-handler.filter';
import { PollingOption } from './modules/polling-option/models/polling-option.entity';
import { Polling } from './modules/polling/models/polling.entity';
import { UserPolling } from './modules/user-polling/models/user-polling.entity';
import { PollingOptionModule } from './modules/polling-option/polling-option.module';
import { PollingModule } from './modules/polling/polling.module';
import { AuthModule } from './modules/auth/auth.module';
import { PollingGatewayModule } from './modules/polling_gateway/polling-gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserPollingModule } from './modules/user-polling/user-polling.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [
    { provide: APP_PIPE, useClass: DataValidationPipe },
    { provide: APP_FILTER, useClass: ExceptionHandlerFilter },
  ],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432, // <--- Port default PostgreSQL
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Polling, PollingOption, UserPolling],
      synchronize: true,
      migrationsRun: false,
      logger: 'advanced-console',
      poolSize: 3,
      extra: {
        timezone: process.env.DB_TIMEZONE || 'Asia/Jakarta',
      },
    }),
    AuthModule,
    PollingModule,
    PollingOptionModule,
    PollingGatewayModule,
    UserPollingModule,
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
