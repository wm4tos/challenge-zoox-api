import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StateService } from './state.service';
import { StateController } from './state.controller';
import { StateSchema } from './state.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'State', schema: StateSchema }]),
    CacheModule.register({
      ttl: 600,
    }),
  ],
  controllers: [StateController],
  providers: [StateService],
})
export class StateModule {}
