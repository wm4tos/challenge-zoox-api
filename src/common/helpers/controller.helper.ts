import { Controller as C, applyDecorators } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

export const Controller = (name: string = '') => {  
  return applyDecorators(
    C(name),
    ApiTags(name)
  )
}