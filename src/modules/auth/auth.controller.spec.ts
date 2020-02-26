import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { UserDto } from 'src/modules/users/dtos/user.dto';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthMessages } from './enums/messages.enum';
import { AuthenticateDto } from './dtos/login.dto';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const users: UserDto[] = [
    {
      _id: new ObjectId(),
      name: 'Wesley Matos',
      email: 'wrickee@gmail.com',
      password: 'wes123',
    },
  ];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'kkk',
          signOptions: { expiresIn: '3600s' },
        }),
        PassportModule,
      ],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  describe('authenticate', () => {
    it('user successfully logged', () => {
      const [wesley] = users;
      const expected = 'token';
      
      jest.spyOn(service, 'userExists').mockResolvedValue(wesley);
      jest.spyOn(service, 'validateUserAndPassword').mockResolvedValue(wesley);
      jest.spyOn(service, 'createToken').mockReturnValue(expected);
      return controller.authenticate(wesley as AuthenticateDto)
        .then(res => {
          expect(res).toStrictEqual(new ResponseDto(true, expected));
        });
    });

    it('user was not found', () => {
      const [wesley] = users;

      jest.spyOn(service, 'userExists').mockResolvedValue(null);
      jest.spyOn(service, 'validateUserAndPassword').mockResolvedValue(null);
      return controller.authenticate(wesley as AuthenticateDto)
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.getResponse()).toStrictEqual(new ResponseDto(false, null, AuthMessages.NOT_FOUND));
        });
    });

    it('user with invalid password', () => {
      const [wesley] = users;
      
      jest.spyOn(service, 'userExists').mockResolvedValue(wesley);
      jest.spyOn(service, 'validateUserAndPassword').mockResolvedValue(null);
      jest.spyOn(service, 'createToken').mockReturnValue('');
      return controller.authenticate(wesley as AuthenticateDto)
        .catch((err: UnauthorizedException) => {
          expect(err.getStatus()).toBe(401);
          expect(err.getResponse()).toStrictEqual(new ResponseDto(false, null, AuthMessages.INVALID));
        });
    });
  });
});
