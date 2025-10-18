import { StatusResponse } from '@app/enums/status-response';
import { ApiProperty } from '@nestjs/swagger';

export class BaseApiResponse {
  @ApiProperty({ example: StatusResponse.SUCCESS, enum: StatusResponse })
  status!: StatusResponse;

  @ApiProperty({ example: 'ok' })
  message?: string;
}

export class PaginationMetaDataResponse {
  @ApiProperty({
    example: 150,
  })
  totalRecords: number;

  @ApiProperty({
    example: 15,
  })
  totalPages: number;

  @ApiProperty({
    example: 2,
  })
  page: number;

  @ApiProperty({
    example: 10,
  })
  limit: number;
}
