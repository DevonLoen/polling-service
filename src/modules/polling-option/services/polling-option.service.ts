import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PollingOption } from '../models/polling-option.entity';
import { CreatePollingOptionDto } from '@app/modules/polling/dtos/create-polling.dto';

@Injectable()
export class PollingOptionService {
  constructor(
    @InjectRepository(PollingOption)
    private pollingOptionRepository: Repository<PollingOption>,
  ) {}

  async createPollingOptionWithTransaction(
    entityManager: EntityManager,
    dto: CreatePollingOptionDto,
    pollingId: number,
  ) {
    const { desc, option } = dto;
    const pollingOption = entityManager.create(PollingOption, {
      desc,
      option,
      pollingId,
    });
    await entityManager.save(pollingOption);
  }
}
