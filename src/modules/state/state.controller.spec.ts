import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { State } from './state.entity';
import { iterator, add, update, remove } from 'src/common/helpers/test.helper';
import { ResponseDto } from 'src/common/interfaces/response.dto';

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

  const stateIterator = iterator(states);

  let stateAdd, stateUpdater, stateRemover;

  beforeEach(async () => {
    const statesInstance = [].concat(states);
    stateAdd = add(statesInstance);
    stateUpdater = update(statesInstance, stateIterator('find'), stateIterator('findIndex'));
    stateRemover = remove(statesInstance, stateIterator('findIndex'));

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        {
          provide: StateService,
          useValue: {
            findAll(where: State): State|State[] {
              return stateIterator()(where);
            },          
            findOne(where: State): any {
              return stateIterator('find')(where);
            },
            create(data: State): State[] {
              return stateAdd(data);
            },
            update(id: string, data: State): State {
              return stateUpdater({ id }, data);
            },          
            delete(id: string): State[] {
              return stateRemover({ id });
            },
          },
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
      expect(controller.getAll()).resolves.toEqual(new ResponseDto(true, states));
    });

    it('should return "SP" state', () => {
      const expectedData = states.find(x => x.UF === 'SP');
      
      expect(controller.getAll({ id: '1' })).resolves.toEqual(new ResponseDto(true, expectedData));
    });

    it('should return an error because none state with that condition exists', () => {
      expect(controller.getAll({ id: '50' })).rejects.toEqual(new ResponseDto(true, null, 'Nenhum estado foi encontrado com base na sua busca.'));
    });
  });

  describe('getOne', () => {
    it('should return "SP" state', () => {
      const expectedData = states.find(x => x.UF === 'SP');

      expect(controller.getOne('1')).resolves.toEqual(new ResponseDto(true, expectedData));
    });

    it('should return an error because that state does not exists', () => {
      expect(controller.getOne('50')).rejects.toEqual(new ResponseDto(true, null, 'Nenhum estado foi encontrado com base na sua busca.'));
    });
  });

  describe('update', () => {
    it('should return item updated', () => {
      const expectedData = states.find(x => x.UF === 'SP');

      expect(controller.update('1', { UF: 'SJ' })).resolves.toEqual(new ResponseDto(true, expectedData));
    });

    it('should throw error because user does not exists' , () => {
      expect(controller.update('50', { UF: 'SJ' })).rejects.toEqual(new ResponseDto(false, null, 'Estado inexistente.'));
    });
  });

  describe('create', () => {
    it('should return created item', () => {
      const expectedData: State = {
        id: '4',
        name: 'Mato Grosso do Sul',
        UF: 'MS',
        cities: [],
      };

      expect(controller.create(expectedData)).resolves.toEqual(new ResponseDto(true, expectedData));
    });

    it('should return message to duplicated item', () => {
      expect(controller.create(states.slice(0, 1))).rejects.toEqual(new ResponseDto(false, null, 'Estado já cadastrado.'));
    });
  });

  describe('delete', () => {
    it('should return a success message', () => {
      expect(controller.remove('1')).resolves.toEqual(new ResponseDto(true, null, 'Estado removido com sucesso.'));
    });

    it('should return error message because state does not exists', () => {
      expect(controller.remove('50')).rejects.toEqual(new ResponseDto(false, null, 'Estado inexistente.'));
    });
  });
});
