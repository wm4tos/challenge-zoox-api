import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
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
      state: states[0],
    },
    {
      _id: new ObjectId(),
      name: 'Taboão da Serra',
      state: states[0],
    },
    {
      _id: new ObjectId(),
      name: 'Minas Gerais',
      state: states[0],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        CitiesService,
        {
          provide: getModelToken('Cities'),
          useValue: {}
        }
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
    service = module.get<CitiesService>(CitiesService)
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

      return controller.getAll({ _id: SP._id })
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, [SP]));
        });
    });

    it('should return a message because none city with that condition exists', () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      return controller.getAll({ _id: '1' })
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, [], CityMessages.NOT_FOUND_ERROR));
        });
    });
  });

  describe('getOne', () => {
    it('should return "SP" city', () => {
      const [SP] = cities;

      jest.spyOn(service, 'findOne').mockResolvedValue(SP);

      return controller.getOne(SP._id)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, SP));
        });
    });

    it('should return an error because that city does not exists', () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      return controller.getOne(new ObjectId())
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, CityMessages.NOT_FOUND_ERROR));
        });
    });
  });

  describe('update', () => {
    it('should return item updated', () => {
      const [SP] = cities
      const expected = { ...SP, UF: 'SJ' }

      jest.spyOn(service, 'findOne').mockResolvedValue(SP);
      jest.spyOn(service, 'update').mockResolvedValue(expected);

      return controller.update(SP._id, { UF: 'SJ' })
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, expected, CityMessages.UPDATED));
        });
    });

    it('should throw error because user does not exists' , () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      return controller.update(new ObjectId(), { UF: 'SJ' })
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, CityMessages.NOT_FOUND_ERROR));
        });
    });
  });

  describe('create', () => {
    it('should return created item', () => {
      const expected: CityDto = {
        _id: new ObjectId(),
        name: 'Mato Grosso do Sul',
        UF: 'MS',
        cities: [],
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
          expect(err.message).toStrictEqual(new ResponseDto(false, null, CityMessages.DUPLICATED));
        });
    });
  });

  describe('delete', () => {
    it('should return a success message', () => {
      const [SP] = cities;

      jest.spyOn(service, 'findOne').mockResolvedValue(SP);
      jest.spyOn(service, 'delete').mockResolvedValue(null);

      return controller.remove(SP._id)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, null, CityMessages.DELETED));
        });
    });

    it('should return error message because city does not exists', () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      return controller.remove(new ObjectId())
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, CityMessages.NOT_FOUND_ERROR));
        });
    });
  });
});
