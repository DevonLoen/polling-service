// ...existing code...
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({ allowUnknown: false })
export class CreateUserPollingDto {
  @ApiProperty({
    example: 1,
    description: 'Polling Option Id',
  })
  @JoiSchema(Joi.number().min(1).required())
  pollingOptionId: number;
}
