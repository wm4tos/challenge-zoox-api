import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, CacheModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { StateDto } from 'src/modules/state/dtos/state.dto';

import { CityDto } from './dtos/city.dto';
import { CreateCityDto } from './dtos/create-city.dto';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CityMessages } from './enums/messages.enum';

describe('Cities Controller', () => {
  let controller: CitiesController;
  let service: CitiesService;
  const states: StateDto[] = [
    {
      _id: new ObjectId(),
      name: 'São Paulo',
      UF: 'SP',
    },
  ];

  const cities: CityDto[] = [
    {
      _id: new ObjectId(),
      name: 'São Paulo',
      state: states[0]._id as ObjectId,
    },
    {
      _id: new ObjectId(),
      name: 'Taboão da Serra',
      state: states[0]._id as ObjectId,
    },
    {
      _id: new ObjectId(),
      name: 'Minas Gerais',
      state: states[0]._id as ObjectId,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        CitiesService,
        {
          provide: getModelToken('Cities'),
          useValue: {},
        },
      ],
      imports: [CacheModule.register({ ttl: 600 })],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all cities', () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(cities);

      return controller.getAll()
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, cities));
        });
    });

    it('should return an array with "SP" city', () => {
      const [SP] = cities;

      jest.spyOn(service, 'findAll').mockResolvedValue([SP]);

      return controller.getAll({ _id: SP._id as ObjectId })
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, [SP]));
        });
    });

    it('should return a message because none city with that condition exists', () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      return controller.getAll({ _id: '1' })
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.getResponse()).toStrictEqual(new ResponseDto(false, [], CityMessages.NOT_FOUND));
        });
    });
  });

  describe('getOne', () => {
    it('should return "SP" city', () => {
      const [SP] = cities;

      jest.spyOn(service, 'findOne').mockResolvedValue(SP);

      return controller.getOne(SP._id as ObjectId)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, SP));
        });
    });

    it('should return an error because that city does not exists', () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      return controller.getOne(new ObjectId())
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.getResponse()).toStrictEqual(new ResponseDto(false, null, CityMessages.NOT_FOUND));
        });
    });
  });

  describe('update', () => {
    it('should return item updated', () => {
      const [SP] = cities;
      const expected = { ...SP, name: 'SPaulo' };

      jest.spyOn(service, 'findOne').mockResolvedValue(SP);
      jest.spyOn(service, 'update').mockResolvedValue(expected);

      return controller.update(SP._id as ObjectId, { name: 'SPaulo' })
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, expected, CityMessages.UPDATED));
        });
    });

    it('should throw error because user does not exists' , () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      return controller.update(new ObjectId(), { name: 'SPaulo' })
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.getResponse()).toStrictEqual(new ResponseDto(false, null, CityMessages.NOT_FOUND));
        });
    });
  });

  describe('create', () => {
    it('should return created item', () => {
      const [SP] = states;
      const expected: CityDto = {
        name: 'Mato Grosso do Sul',
        state: SP._id as ObjectId,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expected);

      return controller.create(expected as CreateCityDto)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, expected, CityMessages.CREATED));
        });
    });

    it('should return message to duplicated item', () => {
      const [city] = cities;

      jest.spyOn(service, 'create').mockRejectedValue({ code: 11000 });

      return controller.create(city as CreateCityDto)
        .catch((err: ConflictException) => {
          expect(err.getStatus()).toBe(409);
          expect(err.getResponse()).toStrictEqual(new ResponseDto(false, null, CityMessages.DUPLICATED));
        });
    });
  });

  describe('delete', () => {
    it('should return a success message', () => {
      const [SP] = cities;

      jest.spyOn(service, 'findOne').mockResolvedValue(SP);
      jest.spyOn(service, 'delete').mockResolvedValue(null);

      return controller.remove(SP._id as ObjectId)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, null, CityMessages.DELETED));
        });
    });

    it('should return error message because city does not exists', () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      return controller.remove(new ObjectId())
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.getResponse()).toStrictEqual(new ResponseDto(false, null, CityMessages.NOT_FOUND));
        });
    });
  });
});
