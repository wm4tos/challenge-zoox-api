import { ApiResponse as response, ApiResponseOptions } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/interfaces/response.dto';

export const ApiResponse = (options: ApiResponseOptions): MethodDecorator & ClassDecorator => response({ type: ResponseDto, ...options });