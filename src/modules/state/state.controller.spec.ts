import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException, ConflictException,
  // ConflictException, 
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { MockRepository } from 'src/common/__mocks__/repository';

import { StateController } from './state.controller';
import { StateService } from './state.service';
import { StateMessages } from './enums/messages.enum';
import { StateDto } from './dtos/state.dto';
import { CreateStateDto } from './dtos/create-state.dto';

describe('State Controller', () => {
  let controller: StateController;
  const states: StateDto[] = [
    {
      _id: new ObjectId(),
      name: 'São Paulo',
      UF: 'SP',
      cities: [],
    },
    {
      _id: new ObjectId(),
      name: 'Rio de Janeiro',
      UF: 'RJ',
      cities: [],
    },
    {
      _id: new ObjectId(),
      name: 'Minas Gerais',
      UF: 'MG',
      cities: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        StateService,
        {
          provide: getModelToken('State'),
          useValue: MockRepository<StateDto>([].concat(states)),
        },
      ],
    }).compile();

    controller = module.get<StateController>(StateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all states', () => {
      return controller.getAll()
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, states));
        });
    });

    it('should return an array with "SP" state', () => {
      const [SP] = states;

      return controller.getAll({ _id: SP._id })
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, [SP]));
        });
    });

    it('should return a message because none state with that condition exists', () => {
      return controller.getAll({ _id: '1' })
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, [], StateMessages.NOT_FOUND_ERROR));
        });
    });
  });

  describe('getOne', () => {
    it('should return "SP" state', () => {
      const expectedData = states.find(x => x.UF === 'SP');

      return controller.getOne(expectedData._id)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, expectedData));
        });
    });

    it('should return an error because that state does not exists', () => {
      return controller.getOne(new ObjectId())
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.NOT_FOUND_ERROR));
        });
    });
  });

  describe('update', () => {
    it('should return item updated', () => {
      const expectedData = states.find(x => x.UF === 'SP');

      return controller.update(expectedData._id, { UF: 'SJ' })
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, { ...expectedData, UF: 'SJ' }, StateMessages.UPDATED));
        });
    });

    it('should throw error because user does not exists' , () => {
      return controller.update(new ObjectId(), { UF: 'SJ' })
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.INEXISTENT_STATE));
        });
    });
  });

  describe('create', () => {
    it('should return created item', () => {
      const expectedData: StateDto = {
        _id: new ObjectId(),
        name: 'Mato Grosso do Sul',
        UF: 'MS',
        cities: [],
      };

      return controller.create(expectedData as CreateStateDto)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, states.concat(expectedData), StateMessages.CREATED));
        });
    });

    it('should return message to duplicated item', () => {
      const [state] = states;
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
      return controller.remove(SP._id)
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, null, StateMessages.DELETED));
        });
    });

    it('should return error message because state does not exists', () => {
      return controller.remove(new ObjectId())
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(409);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.INEXISTENT_STATE));
        });
    });
  });
});
