import { BaseApiResponse } from '@app/commons/responses/base-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PollingOptionResponse {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Christian',
  })
  option: string;

  @ApiProperty({
    example: 'Bad Boy',
  })
  desc: string;
}

export class createPollingDataResponse {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Polling President',
  })
  title: string;

  @ApiProperty({
    example: 'who is gonna be the president of 2029?',
  })
  question: string;

  @ApiProperty({
    example: 'https://',
  })
  link: string;

  @ApiProperty({
    example: '',
  })
  expiredAt: Date;

  @ApiProperty({ type: PollingOptionResponse, isArray: true })
  pollingOption: PollingOptionResponse[];
}

export class createPollingResponse extends BaseApiResponse {
  @ApiProperty({ type: createPollingDataResponse })
  data: createPollingDataResponse;
}

export class PollingVoteData {
  @ApiProperty({
    example: 100,
    description: 'Total Vote for the Polling Option',
  })
  totalVote: number;

  @ApiProperty({
    example: 1,
    description: 'Id of the Polling Option',
  })
  pollingOptionId: number;

  @ApiProperty({
    example: 'Donald J Trump',
    description: 'Polling Option',
  })
  pollingOption: string;

  @ApiProperty({
    example: 'Business Man',
    description: 'Polling Option Description',
  })
  pollingDesc: string;
}
export class MyPollingChoice {
  @ApiProperty({
    example: 1,
    description: 'Id of the Polling Option',
  })
  pollingOptionId: number;
}
