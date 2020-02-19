import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, Aggregate } from 'mongoose';
import { DeleteWriteOpResultObject, ObjectId } from 'mongodb';

import { StateDto } from './dtos/state.dto';
import { StateDocument } from './state.schema';
import { CreateStateDto } from './dtos/create-state.dto';
import { generateAggregation } from './helpers/aggregate.helper';

@Injectable()
export class StateService {
  constructor(
    @InjectModel('State')
    private readonly stateModel: Model<StateDocument>
  ) {}

  findAll(query?: StateDto): Aggregate<StateDto[]> {
    return this.stateModel.aggregate(generateAggregation(query));
  }

  async findOne(query?: StateDto): Promise<StateDto> {
    return (await this.findAll(query)).shift();
  }

  create(data: CreateStateDto): Promise<StateDto> {
    return this.stateModel.create(data);
  }

  update(_id: ObjectId, data: StateDto): Query<any> {
    return this.stateModel.updateOne({ _id }, data);
  }

  delete(_id: ObjectId): Query<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> {
    return this.stateModel.deleteOne({ _id });
  }
}
