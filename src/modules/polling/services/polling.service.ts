import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Polling } from '../models/polling.entity';
import { EntityManager, Repository } from 'typeorm';
import { PollingOptionService } from '@app/modules/polling-option/services/polling-option.service';
import { CreatePollingDto } from '../dtos/create-polling.dto';
import { createPollingDataResponse } from '../classes/polling,response';
import { PollingOption } from '@app/modules/polling-option/models/polling-option.entity';
import { customAlphabet } from 'nanoid';

@Injectable()
export class PollingService {
  constructor(
    @InjectRepository(Polling)
    private pollingRepository: Repository<Polling>,
    private readonly pollingOptionService: PollingOptionService,
  ) {}

  private readonly nanoid = customAlphabet(
    '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    10,
  );
  private readonly FrontEndBaseUrl =
    process.env.FRONT_END_BASE_URL || 'https://localhost:5000';

  async createPolling(
    dto: CreatePollingDto,
    userId: number,
  ): Promise<createPollingDataResponse> {
    const { title, question, expiredAt, pollingOption } = dto;

    const transaction: createPollingDataResponse =
      await this.pollingRepository.manager.transaction(
        async (entityManager: EntityManager) => {
          const createdPoll = entityManager.create(Polling, {
            title,
            question,
            expiredAt: new Date(expiredAt),
            userId,
          });

          const link = `${this.FrontEndBaseUrl}/${createdPoll.code}`;

          const code = this.nanoid();

          createdPoll.link = link;
          createdPoll.code = code;

          const savedPoll = await entityManager.save(createdPoll);

          for (const option of pollingOption) {
            await this.pollingOptionService.createPollingOptionWithTransaction(
              entityManager,
              option,
              savedPoll.id,
            );
          }

          const poll: Polling = await entityManager.findOne(Polling, {
            where: { id: savedPoll.id },
            relations: ['pollingOption'],
          });

          if (!poll) {
            throw new NotFoundException(
              `Polling not found with that id ${poll.id}`,
            );
          }
          const response: createPollingDataResponse = {
            id: poll.id,
            title: poll.title,
            question: poll.question,
            link: poll.link,
            expiredAt: poll.expiredAt,
            pollingOption: poll.pollingOption.map((opt: PollingOption) => ({
              id: opt.id,
              option: opt.option,
              desc: opt.desc,
            })),
          };

          return response;
        },
      );

    return transaction;
  }

  async findPollingById(id: number): Promise<Polling> {
    const polling = await this.pollingRepository.findOne({
      where: { id },
      relations: ['pollingOption'],
    });

    if (!polling) {
      throw new NotFoundException(`Polling not found with that id ${id}`);
    }
    return polling;
  }
}
