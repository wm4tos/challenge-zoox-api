import { Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ResponseDto } from './common/interfaces/response.dto';
import { ApiResponse } from './common/helpers/api-response.helper';
import { Controller } from './common/helpers/controller.helper';

@Controller('health-check')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: 200 })
  @ApiOperation({ description: 'Rota de health check da aplicação.' })
  getOk(): ResponseDto {
    return new ResponseDto(true, null, this.appService.getOk());
  }
}
