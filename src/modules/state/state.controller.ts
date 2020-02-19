import { Get, Query, UseGuards, HttpStatus, NotFoundException, Param, Body, Post, ConflictException, Put, Delete, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongodb';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { Controller } from 'src/common/helpers/controller.helper';

import { StateService } from './state.service';
import { StateMessages } from './enums/messages.enum';
import { StateDto } from './dtos/state.dto';
import { CreateStateDto } from './dtos/create-state.dto';
import { StateDocument } from './state.schema';

@Controller('states')
export class StateController {
  constructor(
    private readonly stateService: StateService,
  ) {}

  @Get()
  @ApiQuery({
    name: '_id',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'UF',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estados retornados com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: StateMessages.NOT_FOUND,
  })
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(CacheInterceptor)
  async getAll(@Query() query?: StateDto): Promise<ResponseDto> {
    const states = await this.stateService.findAll(query);

    if (states.length) return new ResponseDto(true, states);

    throw new NotFoundException(new ResponseDto(false, states, StateMessages.NOT_FOUND));
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
  @UseInterceptors(CacheInterceptor)
  async getOne(@Param('_id') _id: string | ObjectId): Promise<ResponseDto> {
    const state = await this.stateService.findOne({ _id });

    if (state) return new ResponseDto(true, state);

    throw new NotFoundException(new ResponseDto(false, null, StateMessages.NOT_FOUND));
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: StateMessages.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: StateMessages.DUPLICATED,
  })
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() state: CreateStateDto): Promise<ResponseDto> {
    try {
      const created = await this.stateService.create(state as StateDocument);

      return new ResponseDto(true, created, StateMessages.CREATED);
    } catch (error) {
      switch(error.code) {
      case 11000:
        throw new ConflictException(new ResponseDto(false, null, StateMessages.DUPLICATED));
      default:
        throw error;
      }
    }
  }

  @Put('/:_id')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: StateMessages.UPDATED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: StateMessages.NOT_FOUND,
  })
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('_id') _id: string | ObjectId, @Body() data: StateDto): Promise<ResponseDto> {
    const state = await this.stateService.findOne({ _id: new ObjectId(_id) });

    if (!state) throw new NotFoundException(new ResponseDto(false, null, StateMessages.NOT_FOUND));

    await this.stateService.update(_id as ObjectId, data);

    return new ResponseDto(true, Object.assign(state, data), StateMessages.UPDATED);
  }

  @Delete('/:_id')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: StateMessages.DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: StateMessages.NOT_FOUND,
  })
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('_id') _id: string | ObjectId): Promise<ResponseDto> {
    const state = await this.stateService.findOne({ _id: new ObjectId(_id) });

    if (!state) throw new NotFoundException(new ResponseDto(false, null, StateMessages.NOT_FOUND));

    await this.stateService.delete(new ObjectId(_id));

    return new ResponseDto(true, null, StateMessages.DELETED);
  }
}
