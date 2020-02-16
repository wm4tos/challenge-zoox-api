import { Model, DocumentQuery, Document, Query } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId, DeleteWriteOpResultObject } from 'mongodb';

import { CityDto } from './dtos/city.dto';
import { CitiesDocument } from './cities.schema';
import { CreateCityDto } from './dtos/create-city.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Cities')
    private readonly citiesModel: Model<CitiesDocument>
  ) {}

  findAll(query?: CityDto): DocumentQuery<CitiesDocument[], Document> {
    return this.citiesModel.find(query);
  }

  findOne(query?: CityDto): DocumentQuery<CitiesDocument, Document> {
    return this.citiesModel.findOne(query);
  }

  create(data: CreateCityDto): Promise<CitiesDocument> {
    return this.citiesModel.create(data);
  }

  update(_id: ObjectId, data: CityDto): Query<any> {
    return this.citiesModel.updateOne({ _id }, data);
  }

  delete(_id: ObjectId): Query<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> {
    return this.citiesModel.deleteOne({ _id });
  }
}