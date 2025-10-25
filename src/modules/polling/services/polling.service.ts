import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Polling } from '../models/polling.entity';
import { EntityManager, Repository } from 'typeorm';
import { PollingOptionService } from '@app/modules/polling-option/services/polling-option.service';
import { CreatePollingDto } from '../dtos/create-polling.dto';
import {
  CreatePollingDataResponse,
  GetPollingById,
  MyPollingChoice,
  PollingOptionWithData,
} from '../classes/polling,response';
import { PollingOption } from '@app/modules/polling-option/models/polling-option.entity';
import { customAlphabet } from 'nanoid';

@Injectable()
export class PollingService {
  private logger: Logger = new Logger('Polling');

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
  ): Promise<CreatePollingDataResponse> {
    const { title, question, expiredAt, pollingOption } = dto;

    const transaction: CreatePollingDataResponse =
      await this.pollingRepository.manager.transaction(
        async (entityManager: EntityManager) => {
          const createdPoll = entityManager.create(Polling, {
            title,
            question,
            expiredAt: new Date(expiredAt),
            userId,
          });

          const code = this.nanoid();
          const link = `${this.FrontEndBaseUrl}/${code}`;

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
          const response: CreatePollingDataResponse = {
            id: poll.id,
            title: poll.title,
            question: poll.question,
            link: poll.link,
            expiredAt: poll.expiredAt,
            code: poll.code,
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

  async findPollingByCode(code: string): Promise<Polling> {
    const polling = await this.pollingRepository.findOne({
      where: { code },
    });

    if (!polling) {
      throw new NotFoundException(`Polling not found with that code ${code}`);
    }
    return polling;
  }

  async getPollingVoteDataByCode(
    pollingCode: string,
  ): Promise<PollingOptionWithData[]> {
    const query = `
    select
      count(*) filter (where up.id is not null) total,
      po.id id,
      min(po.option) option,
      min(po.desc) desc
    from pollings p 
    inner join polling_options po on po.polling_id = p.id
    left join user_pollings up on up.polling_option_id = po.id
    where p.code = $1
    group by po.id;
    `;
    const pollingVoteData = await this.pollingRepository.query<
      PollingOptionWithData[]
    >(query, [pollingCode]);
    return pollingVoteData;
  }

  async getPollingAndDataByCode(pollingCode: string): Promise<GetPollingById> {
    const pollingData: PollingOptionWithData[] =
      await this.getPollingVoteDataByCode(pollingCode);
    const polling: Polling = await this.findPollingByCode(pollingCode);
    const pollingWithData: GetPollingById = {
      id: polling.id,
      title: polling.title,
      question: polling.question,
      link: polling.link,
      code: polling.code,
      expiredAt: polling.expiredAt,
      pollingOption: pollingData,
    };
    return pollingWithData;
  }

  async getMyPollingChoiceByCode(
    pollingCode: string,
    userId: number,
  ): Promise<MyPollingChoice> {
    const query = `
    select
      up.polling_option_id pollingOptionId
    from pollings p 
    inner join polling_options po on po.polling_id = p.id
    inner join user_pollings up on up.polling_option_id = po.id
    where p.code = $1 and up.user_id = $2
    `;
    const myPollingChoice = await this.pollingRepository.query<
      MyPollingChoice[]
    >(query, [pollingCode, userId]);
    if (myPollingChoice.length > 1) {
      this.logger.error(
        `Data integrity issue: User ${userId} has multiple votes for polling code ${pollingCode}.`,
      );
      throw new InternalServerErrorException(
        'An inconsistent data state was detected.',
      );
    }
    return myPollingChoice[0] ?? null;
  }

  async getMyPollings(userId: number): Promise<CreatePollingDataResponse[]> {
    const myPollings = await this.pollingRepository.find({
      where: { userId },
      relations: ['pollingOption'],
      order: { id: 'DESC' },
    });

    return myPollings.map((poll: Polling) => ({
      id: poll.id,
      title: poll.title,
      question: poll.question,
      link: poll.link,
      code: poll.code,
      expiredAt: poll.expiredAt,
      pollingOption: (poll.pollingOption || []).map((opt: PollingOption) => ({
        id: opt.id,
        option: opt.option,
        desc: opt.desc,
      })),
    }));
  }
}
