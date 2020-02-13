import { Controller } from 'src/common/helpers/controller.helper';

import { StateService } from './state.service';

Controller('states')
export class StateController {
  constructor(
    private readonly stateService: StateService,
  ) {}
}
