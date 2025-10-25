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
export class PollingOptionWithData {
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

  @ApiProperty({
    example: 10,
  })
  total: number;
}

export class CreatePollingDataResponse {
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
    example: '"46V1PXGTPV"',
  })
  code: string;

  @ApiProperty({
    example: '',
  })
  expiredAt: Date;

  @ApiProperty({ type: PollingOptionResponse, isArray: true })
  pollingOption: PollingOptionResponse[];
}

export class CreatePollingResponse extends BaseApiResponse {
  @ApiProperty({ type: CreatePollingDataResponse })
  data: CreatePollingDataResponse;
}

export class MyPollingChoice {
  @ApiProperty({
    example: 1,
    description: 'Id of the Polling Option',
  })
  pollingOptionId: number;
}

export class GetMyPollingsResponse extends BaseApiResponse {
  @ApiProperty({ type: CreatePollingDataResponse, isArray: true })
  data: CreatePollingDataResponse[];
}

export class GetPollingById {
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
    example: '"46V1PXGTPV"',
  })
  code: string;

  @ApiProperty({
    example: '',
  })
  expiredAt: Date;

  @ApiProperty({ type: PollingOptionWithData, isArray: true })
  pollingOption: PollingOptionWithData[];
}
export class GetPollingByIdResponse extends BaseApiResponse {
  @ApiProperty({ type: CreatePollingDataResponse, isArray: true })
  data: CreatePollingDataResponse[];
}
