import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { PollingOptionService } from '@app/modules/polling-option/services/polling-option.service';
import { UserPolling } from '../models/user-polling.entity';
import { CreateUserPollingDto } from '../dtos/create-user-polling.dto';
import { PollingService } from '@app/modules/polling/services/polling.service';
import { ErrorCode } from '@app/enums/error-code';
import {
  WsConflictException,
  WsNotFoundException,
} from '@app/exceptions/websocket.exception';

@Injectable()
export class UserPollingService {
  private logger: Logger = new Logger('Polling');

  constructor(
    @InjectRepository(UserPolling)
    private userPollingRepository: Repository<UserPolling>,
    private readonly pollingService: PollingService,
    private readonly pollingOptionService: PollingOptionService,
  ) {}

  async createUserPolling(
    roomCode: string,
    createUserPollingDto: CreateUserPollingDto,
    userId: number,
  ): Promise<UserPolling> {
    const checkUserPollExistence =
      await this.pollingService.getMyPollingChoiceByCode(roomCode, userId);
    if (checkUserPollExistence) {
      throw new WsConflictException('You already make a Poll');
    }

    let createdUserPoll: UserPolling;
    try {
      createdUserPoll = await this.userPollingRepository.save({
        pollingOptionId: createUserPollingDto.pollingOptionId,
        userId,
      });
    } catch (err) {
      const queryError = err as QueryFailedError & {
        driverError: { code: ErrorCode; sqlMessage: string };
      };
      if (queryError.driverError.code == ErrorCode.FOREIGN_KEY_CONSTRAINT) {
        throw new WsNotFoundException(
          `${createUserPollingDto.pollingOptionId} Not Found`,
        );
      }
      throw err;
    }
    return createdUserPoll;
  }

  async getUserPollById(id: number): Promise<UserPolling> {
    const userPoll = await this.userPollingRepository.findOne({
      where: { pollingOptionId: id },
    });
    return userPoll;
  }
}
