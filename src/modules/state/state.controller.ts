import { Get, Query, UseGuards, HttpStatus, NotFoundException, Param, Body, Post, HttpException, ConflictException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { Controller } from 'src/common/helpers/controller.helper';

import { StateService } from './state.service';
import { StateMessages } from './enums/messages.enum';
import { StateDto } from './dtos/state.dto';

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
  async getAll(@Query() query?: StateDto): Promise<ResponseDto> {
    const states = await this.stateService.findAll(query);

    if (states.length) return new ResponseDto(true, states);

    throw new NotFoundException(new ResponseDto(false, states, StateMessages.NOT_FOUND_ERROR));
  }

  @Get('/:_id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estado encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Estado não encontrado.',
  })
  @UseGuards(AuthGuard('jwt'))
  async getOne(@Param('_id') _id: string): Promise<ResponseDto> {
    const state = await this.stateService.findOne({ _id });

    if (state) return new ResponseDto(true, state);

    throw new NotFoundException(new ResponseDto(false, null, StateMessages.NOT_FOUND_ERROR));
  }
}
