import { Get, HttpStatus, NotFoundException, Param, Post, Body, ConflictException, Put, Delete, UseGuards, Query, UseInterceptors, CacheInterceptor, Inject } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

import { Controller } from 'src/common/helpers/controller.helper';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { ResponseDto } from 'src/common/interfaces/response.dto';

import { CitiesService } from './cities.service';
import { CityMessages } from './enums/messages.enum';
import { CityDto } from './dtos/city.dto';
import { CreateCityDto } from './dtos/create-city.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthMessages } from '../auth/enums/messages.enum';
import { CommonMessages } from 'src/common/enums/messages.enum';

@Controller('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    @Inject('CACHE_MANAGER') private readonly cacheManager,
  ){}

  @Get()
  @ApiQuery({
    name: '_id',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: CityMessages.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CityMessages.NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommonMessages.UNAUTHORIZED,
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  async getAll(@Query() query?: CityDto): Promise<ResponseDto> {
    const cities = await this.citiesService.findAll(query);

    if (cities.length) return new ResponseDto(true, cities);

    throw new NotFoundException(new ResponseDto(false, cities, CityMessages.NOT_FOUND));
  }

  @Get('/:_id')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: CityMessages.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CityMessages.NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommonMessages.UNAUTHORIZED,
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(CacheInterceptor)
  async getOne(@Param('_id') _id: ObjectId): Promise<ResponseDto> {
    const city = await this.citiesService.findOne({ _id });

    if (city) return new ResponseDto(true, city);

    throw new NotFoundException(new ResponseDto(false, null, CityMessages.NOT_FOUND));
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: CityMessages.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: CityMessages.DUPLICATED,
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
  async create(@Body() city: CreateCityDto): Promise<ResponseDto> {
    try {
      const created = await this.citiesService.create(city);

      this.resetCache();

      return new ResponseDto(true, created, CityMessages.CREATED);
    } catch (error) {
      switch(error.code) {
      case 11000:
        throw new ConflictException(new ResponseDto(false, null, CityMessages.DUPLICATED));
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
    description: CityMessages.UPDATED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CityMessages.NOT_FOUND,
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
  async update(@Param('_id') _id: ObjectId, @Body() data: CityDto): Promise<ResponseDto> {
    const city = await this.citiesService.findOne({ _id });

    if (!city) throw new NotFoundException(new ResponseDto(false, null, CityMessages.NOT_FOUND));

    await this.citiesService.update(_id, data);

    this.resetCache(_id);

    return new ResponseDto(true, Object.assign(city, data), CityMessages.UPDATED);
  }

  @Delete('/:_id')
  @ApiParam({
    name: '_id',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: CityMessages.DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CityMessages.NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CommonMessages.UNAUTHORIZED,
  })
  @UseGuards(AuthGuard)
  async remove(@Param('_id') _id: ObjectId): Promise<ResponseDto> {
    const city = await this.citiesService.findOne({ _id });

    if (!city) throw new NotFoundException(new ResponseDto(false, null, CityMessages.NOT_FOUND));

    await this.citiesService.delete(_id);

    this.resetCache(_id);

    return new ResponseDto(true, null, CityMessages.DELETED);
  }

  private resetCache(_id?: String | ObjectId) {
    this.cacheManager.del('/api/cities');
    console.log('_id :', _id);
    if (_id) this.cacheManager.del(`/api/cities/${_id}`);
  }
}
