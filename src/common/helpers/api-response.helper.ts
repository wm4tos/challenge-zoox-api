import { ApiResponse as response, ApiResponseOptions } from '@nestjs/swagger';
import { ResponseDto } from '../interfaces/response.dto';

export const ApiResponse = (options: ApiResponseOptions) => response({ type: ResponseDto, ...options })