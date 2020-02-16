import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, DocumentQuery, Document } from 'mongoose';
import { DeleteWriteOpResultObject } from 'mongodb';

import { StateDto } from './dtos/state.dto';
import { StateDocument } from './state.schema';
import { CreateStateDto } from './dtos/create-state.dto';

@Injectable()
export class StateService {
  constructor(
    @InjectModel('State')
    private readonly stateRepository: Model<StateDocument>
  ) {}

  findAll(query?: StateDto): DocumentQuery<StateDocument[], Document> {
    return this.stateRepository.find(query);
  }

  findOne(query?: StateDto): DocumentQuery<StateDocument, Document> {
    return this.stateRepository.findOne(query);
  }

  create(data: CreateStateDto): Promise<StateDocument> {
    return this.stateRepository.create(data);
  }

  update(id: string, data: StateDto): Query<any> {
    return this.stateRepository.update({ id }, data);
  }

  delete(id: string): Query<DeleteWriteOpResultObject['result'] & { deletedCount?: number }> {
    return this.stateRepository.remove({ id });
  }
}
