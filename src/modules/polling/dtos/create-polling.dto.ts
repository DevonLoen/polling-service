// ...existing code...
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({ allowUnknown: false })
export class CreatePollingOptionDto {
  @ApiProperty({ example: 'Christian', description: 'Label pilihan' })
  @JoiSchema(Joi.string().trim().min(1).required())
  option: string;

  @ApiProperty({
    example: 'Anak Nakal',
    description: 'Deskripsi pilihan',
    required: false,
  })
  @JoiSchema(Joi.string().trim().allow('').optional())
  desc?: string;
}

@JoiSchemaOptions({ allowUnknown: false })
export class CreatePollingDto {
  @ApiProperty({
    example: 'Polling President',
    description: 'Title Polling',
  })
  @JoiSchema(Joi.string().trim().min(3).required())
  title: string;

  @ApiProperty({
    example: 'Who is gonna be president in 2029?',
    description: 'Question Polling',
  })
  @JoiSchema(Joi.string().trim().min(3).required())
  question: string;

  @ApiProperty({
    example: '2025-10-18T18:27:19.000Z',
    description: 'Expired Date (ISO 8601)',
  })
  @JoiSchema(Joi.date().iso().required())
  expiredAt: string;

  @ApiProperty({
    type: () => CreatePollingOptionDto,
    isArray: true,
    example: [{ option: 'Christian', desc: 'Bad Boy' }],
    description: 'Polling Option List (min 1)',
  })
  @JoiSchema(
    Joi.array()
      .items(
        Joi.object({
          option: Joi.string().trim().min(1).required(),
          desc: Joi.string().trim().allow('').optional(),
        }),
      )
      .min(1)
      .required(),
  )
  pollingOption: CreatePollingOptionDto[];
}
