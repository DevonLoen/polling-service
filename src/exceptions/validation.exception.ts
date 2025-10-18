import { BadRequestException } from '@nestjs/common';
export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InsufficientStockException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}

export class InsufficientNominalException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidDateRangeException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidSecurityPinException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
