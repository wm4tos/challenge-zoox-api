import { Controller as C, applyDecorators } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

export const Controller = (name = ''): MethodDecorator & ClassDecorator => {  
  return applyDecorators(
    C(name),
    ApiTags(name),
    ApiBearerAuth()
  );
};