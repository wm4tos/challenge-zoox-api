import { Get, HttpStatus, NotFoundException, Param, Post, Body, ConflictException, Put } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { Controller } from 'src/common/helpers/controller.helper';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { ResponseDto } from 'src/common/interfaces/response.dto';

import { CitiesService } from './cities.service';
import { CityMessages } from './enums/messages.enum';
import { CityDto } from './dtos/city.dto';
import { CreateCityDto } from './dtos/create-city.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService
  ){}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: CityMessages.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: CityMessages.NOT_FOUND,
  })
  async getAll(query?: CityDto): Promise<ResponseDto> {
    const cities = await this.citiesService.findAll(query);

    if (cities.length) return new ResponseDto(true, cities);

    throw new NotFoundException(new ResponseDto(false, cities, CityMessages.NOT_FOUND))
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
  async getOne(@Param('_id') _id: ObjectId): Promise<ResponseDto> {
    const city = await this.citiesService.findOne({ _id });

    if (city) return new ResponseDto(true, city);

    throw new NotFoundException(new ResponseDto(false, null, CityMessages.NOT_FOUND))
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: CityMessages.CREATED
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: CityMessages.DUPLICATED,
  })
  async create(@Body() city: CreateCityDto): Promise<ResponseDto> {
    try {
      const created = await this.citiesService.create(city);

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
  async update(@Param('_id') _id: string | ObjectId, @Body() data: CityDto): Promise<ResponseDto> {
    const city = await this.citiesService.findOne({ _id });

    if (!city) throw new NotFoundException(new ResponseDto(false, null, CityMessages.NOT_FOUND));

    await this.citiesService.update(_id as ObjectId, data);

    return new ResponseDto(true, Object.assign(city, data), CityMessages.UPDATED);
  }
}
