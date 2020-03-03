import { Get, Query, UseGuards, HttpStatus, NotFoundException, Param, Body, Post, ConflictException, Put, Delete, UseInterceptors, CacheInterceptor, Inject } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { Controller } from 'src/common/helpers/controller.helper';
import { CommonMessages } from 'src/common/enums/messages.enum';

import { StateService } from './state.service';
import { StateMessages } from './enums/messages.enum';
import { StateDto } from './dtos/state.dto';
import { CreateStateDto } from './dtos/create-state.dto';
import { StateDocument } from './state.schema';
import { AuthGuard } from '../auth/auth.guard';

@Controller('states')
export class StateController {
  constructor(
    private readonly stateService: StateService,
    @Inject('CACHE_MANAGER') private readonly cacheManager,
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommonMessages.UNAUTHORIZED,
  })
  @UseGuards(AuthGuard)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommonMessages.UNAUTHORIZED,
  })
  @UseGuards(AuthGuard)
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommonMessages.UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CommonMessages.BAD_REQUEST,
  })
  @UseGuards(AuthGuard)
  async create(@Body() state: CreateStateDto): Promise<ResponseDto> {
    try {
      const created = await this.stateService.create(state as StateDocument);

      this.resetCache();

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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommonMessages.UNAUTHORIZED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: CommonMessages.BAD_REQUEST,
  })
  @UseGuards(AuthGuard)
  async update(@Param('_id') _id: string | ObjectId, @Body() data: StateDto): Promise<ResponseDto> {
    const state = await this.stateService.findOne({ _id: new ObjectId(_id) });

    if (!state) throw new NotFoundException(new ResponseDto(false, null, StateMessages.NOT_FOUND));

    await this.stateService.update(_id as ObjectId, data);

    this.resetCache(_id);

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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommonMessages.UNAUTHORIZED,
  })
  @UseGuards(AuthGuard)
  async remove(@Param('_id') _id: string | ObjectId): Promise<ResponseDto> {
    const state = await this.stateService.findOne({ _id: new ObjectId(_id) });

    if (!state) throw new NotFoundException(new ResponseDto(false, null, StateMessages.NOT_FOUND));

    await this.stateService.delete(new ObjectId(_id));

    this.resetCache(_id);

    return new ResponseDto(true, null, StateMessages.DELETED);
  }

  private resetCache(_id?: String | ObjectId) {
    this.cacheManager.del('/api/states');
    if (_id) this.cacheManager.del(`/api/states/${_id}`);
  }
}
