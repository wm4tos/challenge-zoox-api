import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserDocument } from './users.schema';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userRepository: Model<UserDocument>
  ) {}

  async findOneByEmail(email: string): Promise<UserDocument> {
    return this.userRepository.findOne({ email });
  }

  async findAll(query?: UserDto): Promise<UserDto[]> {
    return this.userRepository.find(query, { password: 0 });
  }

  async create({ password: pass, ...data }: CreateUserDto): Promise<UserDto> {
    const password = bcrypt.hashSync(pass, bcrypt.genSaltSync(13));

    const user = await this.userRepository.create(Object.assign(data, { password }));

    return user
      .toJSON({
        transform: ({ _doc }) => {
          delete _doc.password;

          return _doc;
        },
      });
  }
}
