import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userRepository: Model<UserDocument>
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async findAll(query: User): Promise<User[]> {
    return this.userRepository.find(query);
  }

  async create(data: User): Promise<User> {
    return this.userRepository.create(data);
  }
}
