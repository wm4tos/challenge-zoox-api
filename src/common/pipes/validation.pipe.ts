import { ValidationPipe, ValidationPipeOptions, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ResponseDto } from '../interfaces/response.dto';


export class FormatedValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super(options);
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      const result = await super.transform(value, metadata);

      return result;
    } catch (error) {
      const { message: { message } } = error;

      throw new BadRequestException(new ResponseDto(false, null, message));
    }
  }
}