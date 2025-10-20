import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPolling } from './models/user-polling.entity';
import { UserPollingService } from './services/user-polling.service';
import { PollingModule } from '../polling/polling.module';
import { PollingOptionModule } from '../polling-option/polling-option.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserPolling]),
    PollingModule,
    PollingOptionModule,
  ],
  providers: [UserPollingService],
  controllers: [],
  exports: [UserPollingService],
})
export class UserPollingModule {}
