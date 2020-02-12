import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseDto } from './common/interfaces/response.dto';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        provide: AppService,
        useValue: {
          getOk: jest.fn(() => 'Api ok!'),
        },
      }],
    }).compile();
  });

  describe('getOk', () => {
    it('should return "Api ok!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getOk()).toEqual(new ResponseDto(true, null, 'Api ok!'));
    });
  });
});
