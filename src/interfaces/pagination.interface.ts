import { ValidationRegex } from '@app/enums/validation-regex';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import * as Joi from 'joi';
import { JoiSchema } from 'joi-class-decorators';
import { IBaseApiResponse } from './response.interface';
import { BaseApiResponse } from '@app/commons/responses/base-response.dto';

export interface BasePagination<T> {
  data: T[];
}

export interface OffsetPagination<T> extends BasePagination<T> {
  totalCount: number;
  filteredCount?: number;
}

export class BasePaginationQuery {
  @ApiProperty({
    example: 10,
    required: false,
    description: 'Empty or zero default to 10',
  })
  @Transform(({ value }: TransformFnParams): string => {
    if (value === '0' || value === undefined) {
      return '10';
    }
    return value;
  })
  @JoiSchema(Joi.string().regex(ValidationRegex.NUMBER_STRING).optional())
  pageSize?: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Empty or zero default to 1',
  })
  @Transform(({ value }: TransformFnParams): string => {
    if (value === '0' || value === undefined) {
      return '1';
    }
    return value;
  })
  @JoiSchema(Joi.string().regex(ValidationRegex.NUMBER_STRING).optional())
  pageNo?: string;
}

export class OffsetPaginationMeta {
  @ApiProperty({ example: 1 })
  totalRecords!: number;

  @ApiProperty({ example: 1 })
  totalPages?: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}

export class MetaData {
  @ApiProperty({ example: 'string' })
  status!: string;

  @ApiProperty({ example: new Date() })
  timestamp!: Date;
}

export interface BasePaginationResponse<T> extends BaseApiResponse {
  data: T[];
}

export interface OffsetPaginationResponse<T> extends BasePaginationResponse<T> {
  meta: OffsetPaginationMeta;
}
