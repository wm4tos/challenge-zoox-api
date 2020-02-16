import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './users.schema';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userRepository: Model<UserDocument>
  ) {}

  async findOneByEmail(email: string): Promise<UserDto> {
    return this.userRepository.findOne({ email });
  }

  async findAll(query?: UserDto): Promise<UserDto[]> {
    return this.userRepository.find(query);
  }

  async create(data: UserDto): Promise<UserDto> {
    return this.userRepository.create(data);
  }
}
