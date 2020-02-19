import { Model, Query, Aggregate, DocumentQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId, DeleteWriteOpResultObject } from 'mongodb';

import { CityDto } from './dtos/city.dto';
import { CitiesDocument } from './cities.schema';
import { CreateCityDto } from './dtos/create-city.dto';
import { generateAggregation } from './helpers/aggregate.helper';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel('Cities')
    private readonly citiesModel: Model<CitiesDocument>
  ) {}

  findAll(query: CityDto = {}): Aggregate<CityDto[]> {
    return this.citiesModel.aggregate<CityDto>(generateAggregation(query));
  }

  async findOne(query?: CityDto): Promise<CityDto> {
    return (await this.findAll(query)).shift()
  }

  create(data: CreateCityDto): Promise<CityDto | any> {
    return this.citiesModel.create(data);
  }

  update(_id: ObjectId, data: CityDto): Query<any> {
    return this.citiesModel.updateOne({ _id }, data);
  }

  delete(_id: ObjectId): Query<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> {
    return this.citiesModel.deleteOne({ _id });
  }
}