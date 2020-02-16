import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, DocumentQuery, Document } from 'mongoose';
import { DeleteWriteOpResultObject, ObjectId } from 'mongodb';

import { StateDto } from './dtos/state.dto';
import { StateDocument } from './state.schema';
import { CreateStateDto } from './dtos/create-state.dto';

@Injectable()
export class StateService {
  constructor(
    @InjectModel('State')
    private readonly stateModel: Model<StateDocument>
  ) {}

  findAll(query?: StateDto): DocumentQuery<StateDto[] | any, Document> {
    return this.stateModel.find(query);
  }

  findOne(query?: StateDto): DocumentQuery<StateDto | any, Document> {
    return this.stateModel.findOne(query);
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
