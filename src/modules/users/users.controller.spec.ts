import { Test } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { getModelToken } from '@nestjs/mongoose';

import { ResponseDto } from 'src/common/interfaces/response.dto';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserMessages } from './enums/messages.enum';
import { ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const users: UserDto[] = [
    {
      _id: new ObjectId(),
      name: 'Wesley Matos',
      email: 'wrickee@gmail.com',
      password: '',
    },
  ];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  describe('createUser', () => {
    it('should return user created', () => {
      const _id = new ObjectId();
      const [wesley] = users;

      jest.spyOn(service, 'create').mockResolvedValue({
        _id,
        ...wesley,
      });

      return controller.createUser(wesley as CreateUserDto)
        .then(res => {
          return expect(res).toStrictEqual(new ResponseDto(true, { _id, ...wesley }, UserMessages.REGISTERED));
        });
    });

    it('should return ConflictException', () => {
      const [wesley] = users;

      jest.spyOn(service, 'create').mockRejectedValue({ code: 11000 });

      return controller.createUser(wesley as CreateUserDto)
        .catch((err: ConflictException) => {
          expect(err.getStatus()).toBe(409);
          expect(err.getResponse()).toStrictEqual(new ResponseDto(false, null, UserMessages.DUPLICATED));
        });
    });
  });
});
