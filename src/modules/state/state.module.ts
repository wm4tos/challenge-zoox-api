import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateService } from './state.service';
import { State } from './state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([State])],
  providers: [StateService],
})
export class StateModule {}
