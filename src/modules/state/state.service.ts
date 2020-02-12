import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './state.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>
  ) {}

  findAll(where: State): Promise<State[]> {
    return this.stateRepository.find({ where });
  }

  findOne(where: State): Promise<State> {
    return this.stateRepository.findOne({ where });
  }

  create(data: State): State {
    return this.stateRepository.create(data)
  }

  update(id: string, data: State): Promise<UpdateResult> {
    return this.stateRepository.update({ id }, data)
  }

  delete(id: string): Promise<DeleteResult> {
    return this.stateRepository.delete({ id })
  }
}
