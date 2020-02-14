import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  // ConflictException, 
} from '@nestjs/common';

import { ResponseDto } from 'src/common/interfaces/response.dto';
import { MockRepository } from 'src/common/__mocks__/repository';

import { StateController } from './state.controller';
import { StateService } from './state.service';
import { State } from './state.entity';
import { StateMessages } from './enums/messages.enum';

describe('State Controller', () => {
  let controller: StateController;
  const states: State[] = [
    {
      id: '1',
      name: 'São Paulo',
      UF: 'SP',
      cities: [],
    },
    {
      id: '2',
      name: 'Rio de Janeiro',
      UF: 'RJ',
      cities: [],
    },
    {
      id: '3',
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
          provide: getRepositoryToken(State),
          useValue: MockRepository<State>([].concat(states)),
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

    it('should return "SP" state', () => {
      const expectedData = states.filter(x => x.id === '1');

      return controller.getAll({ id: '1' })
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, expectedData));
        });
    });

    it('should return a message because none state with that condition exists', () => {
      return controller.getAll({ id: '1' })
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, [], StateMessages.NOT_FOUND_ERROR));
        });
    });
  });

  describe('getOne', () => {
    it('should return "SP" state', () => {
      const expectedData = states.find(x => x.UF === 'SP');

      return controller.getOne('1')
        .then((response: ResponseDto) => {
          expect(response).toStrictEqual(new ResponseDto(true, expectedData));
        });
    });

    it('should return an error because that state does not exists', () => {
      return controller.getOne('50')
        .catch((err: NotFoundException) => {
          expect(err.getStatus()).toBe(404);
          expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.NOT_FOUND_ERROR));
        });
    });
  });

  // describe('update', () => {
  //   it('should return item updated', () => {
  //     const expectedData = states.find(x => x.UF === 'SP');

  //     return controller.update('1', { UF: 'SJ' })
  //       .then((response: ResponseDto) => {
  //         expect(response).toStrictEqual(new ResponseDto(true, expectedData));
  //       });
  //   });

  //   it('should throw error because user does not exists' , () => {
  //     return controller.update('50', { UF: 'SJ' })
  //       .catch((err: NotFoundException) => {
  //         expect(err.getStatus()).toBe(404);
  //         expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.INEXISTENT_STATE));
  //       });
  //   });
  // });

  // describe('create', () => {
  //   it('should return created item', () => {
  //     const expectedData: State = {
  //       id: '4',
  //       name: 'Mato Grosso do Sul',
  //       UF: 'MS',
  //       cities: [],
  //     };

  //     return controller.create(expectedData)
  //       .then((response: ResponseDto) => {
  //         expect(response).toStrictEqual(new ResponseDto(true, expectedData));
  //       });
  //   });

  //   it('should return message to duplicated item', () => {
  //     return controller.create(states.slice(0, 1))
  //       .catch((err: ConflictException) => {
  //         expect(err.getStatus()).toBe(409);
  //         expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.DUPLICATED));
  //       });
  //   });
  // });

  // describe('delete', () => {
  //   it('should return a success message', () => {
  //     return controller.remove('1')
  //       .then((response: ResponseDto) => {
  //         expect(response).toStrictEqual(new ResponseDto(true, null, StateMessages.DELETED));
  //       });
  //   });

  //   it('should return error message because state does not exists', () => {
  //     return controller.remove('50')
  //       .catch((err: NotFoundException) => {
  //         expect(err.getStatus()).toBe(409);
  //         expect(err.message).toStrictEqual(new ResponseDto(false, null, StateMessages.INEXISTENT_STATE));
  //       });
  //   });
  // });
});
