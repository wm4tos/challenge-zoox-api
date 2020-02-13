import { Get, Query, UseGuards, HttpStatus, NotFoundException } from '@nestjs/common';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { Controller } from 'src/common/helpers/controller.helper';

import { StateService } from './state.service';
import { State } from './state.entity';
import { StateMessages } from './enums/messages.enum';
import { AuthGuard } from '@nestjs/passport';

@Controller('states')
export class StateController {
  constructor(
    private readonly stateService: StateService,
  ) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estados retornados com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Nenhum estado encontrado.',
  })
  @UseGuards(AuthGuard('jwt'))
  async getAll(@Query() query?: State): Promise<ResponseDto> {
    const states = await this.stateService.findAll(query);

    if (states.length) return new ResponseDto(true, states);

    throw new NotFoundException(new ResponseDto(false, states, StateMessages.NOT_FOUND_ERROR));
  }
}
