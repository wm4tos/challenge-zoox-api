import { Get, HttpStatus, NotFoundException } from '@nestjs/common';

import { Controller } from 'src/common/helpers/controller.helper';
import { ApiResponse } from 'src/common/helpers/api-response.helper';

import { CitiesService } from './cities.service';
import { CityMessages } from './enums/messages.enum';
import { CityDto } from './dtos/city.dto';
import { ResponseDto } from 'src/common/interfaces/response.dto';

@Controller('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService
  ){}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cidades retornadas com sucesso.',
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
}