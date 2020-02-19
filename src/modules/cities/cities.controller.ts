import { Get, HttpStatus, NotFoundException, Param, Post, Body, ConflictException, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongodb';

import { Controller } from 'src/common/helpers/controller.helper';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { ResponseDto } from 'src/common/interfaces/response.dto';

import { CitiesService } from './cities.service';
import { CityMessages } from './enums/messages.enum';
import { CityDto } from './dtos/city.dto';
import { CreateCityDto } from './dtos/create-city.dto';

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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('_id') _id: ObjectId, @Body() data: CityDto): Promise<ResponseDto> {
    const city = await this.citiesService.findOne({ _id });

    if (!city) throw new NotFoundException(new ResponseDto(false, null, CityMessages.NOT_FOUND));

    await this.citiesService.update(_id, data);

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
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('_id') _id: ObjectId) {
    const city = await this.citiesService.findOne({ _id });

    if (!city) throw new NotFoundException(new ResponseDto(false, null, CityMessages.NOT_FOUND));

    await this.citiesService.delete(_id);

    return new ResponseDto(true, null, CityMessages.DELETED);
  }
}
