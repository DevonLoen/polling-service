import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollingOption } from './models/polling-option.entity';
import { PollingOptionService } from './services/polling-option.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PollingOption])],
  providers: [PollingOptionService],
  controllers: [],
  exports: [PollingOptionService],
})
export class PollingOptionModule {}
