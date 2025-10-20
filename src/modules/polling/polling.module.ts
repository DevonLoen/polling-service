import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollingService } from './services/polling.service';
import { Polling } from './models/polling.entity';
import { PollingController } from './controllers/polling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Polling])],
  providers: [PollingService],
  controllers: [PollingController],
  exports: [PollingService],
})
export class PollingModule {}
