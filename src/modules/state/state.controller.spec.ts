import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, CacheModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { ResponseDto } from 'src/common/interfaces/response.dto';

import { StateController } from './state.controller';
import { StateService } from './state.service';
import { StateMessages } from './enums/messages.enum';
import { StateDto } from './dtos/state.dto';
import { CreateStateDto } from './dtos/create-state.dto';

describe('State Controller', () => {
  let controller: StateController;
  let service: StateService;
  const states: StateDto[] = [
    {
      _id: new ObjectId(),
      name: 'São Paulo',
      UF: 'SP',
    },
    {
      _id: new ObjectId(),
      name: 'Rio de Janeiro',
      UF: 'RJ',
    },
    {
      _id: new ObjectId(),
      name: 'Minas Gerais',
      UF: 'MG',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        StateService,
        {
          provide: getModelToken('State'),
          useValue: {}
        }
      ],
      imports: [CacheModule.register({ ttl: 600 })]
    }).compile();

    controller = module.get<StateController>(StateController);
    service = module.get<StateService>(StateService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all states', () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(states);

      return controller.getAll()
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, states));
        });
    });

    it('should return an array with "SP" state', () => {
      const [SP] = states;

      jest.spyOn(service, 'findAll').mockResolvedValue([SP]);

      return controller.getAll({ _id: SP._id })
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, [SP]));
        });
    });

    it('should return a message because none state with that condition exists', () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      return controller.getAll({ _id: '1' })
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, [], StateMessages.NOT_FOUND));
        });
    });
  });

  describe('getOne', () => {
    it('should return "SP" state', () => {
      const [SP] = states;

      jest.spyOn(service, 'findOne').mockResolvedValue(SP);

      return controller.getOne(SP._id)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, SP));
        });
    });

    it('should return an error because that state does not exists', () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      return controller.getOne(new ObjectId())
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.NOT_FOUND));
        });
    });
  });

  describe('update', () => {
    it('should return item updated', () => {
      const [SP] = states
      const expected = { ...SP, UF: 'SJ' }

      jest.spyOn(service, 'findOne').mockResolvedValue(SP);
      jest.spyOn(service, 'update').mockResolvedValue(expected);

      return controller.update(SP._id, { UF: 'SJ' })
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, expected, StateMessages.UPDATED));
        });
    });

    it('should throw error because user does not exists' , () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      return controller.update(new ObjectId(), { UF: 'SJ' })
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.NOT_FOUND));
        });
    });
  });

  describe('create', () => {
    it('should return created item', () => {
      const expected: StateDto = {
        _id: new ObjectId(),
        name: 'Mato Grosso do Sul',
        UF: 'MS',
      };

      jest.spyOn(service, 'create').mockResolvedValue(expected);

      return controller.create(expected as CreateStateDto)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, expected, StateMessages.CREATED));
        });
    });

    it('should return message to duplicated item', () => {
      const [state] = states;

      jest.spyOn(service, 'create').mockRejectedValue({ code: 11000 });

      return controller.create(state as CreateStateDto)
        .catch((err: ConflictException) => {
          expect(err.getStatus()).toBe(409);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.DUPLICATED));
        });
    });
  });

  describe('delete', () => {
    it('should return a success message', () => {
      const [SP] = states;

      jest.spyOn(service, 'findOne').mockResolvedValue(SP);
      jest.spyOn(service, 'delete').mockResolvedValue(null);

      return controller.remove(SP._id)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, null, StateMessages.DELETED));
        });
    });

    it('should return error message because state does not exists', () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      return controller.remove(new ObjectId())
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.NOT_FOUND));
        });
    });
  });
});
