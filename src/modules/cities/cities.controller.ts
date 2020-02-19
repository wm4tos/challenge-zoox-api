import { Get, HttpStatus, NotFoundException, Param, Post, Body, ConflictException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { Controller } from 'src/common/helpers/controller.helper';
import { ApiResponse } from 'src/common/helpers/api-response.helper';
import { ResponseDto } from 'src/common/interfaces/response.dto';

import { CitiesService } from './cities.service';
import { CityMessages } from './enums/messages.enum';
import { CityDto } from './dtos/city.dto';

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
}