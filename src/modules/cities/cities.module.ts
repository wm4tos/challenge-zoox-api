import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CitiesSchema } from './cities.schema';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';

@Module({
  controllers: [CitiesController],
  imports: [MongooseModule.forFeature([{ name: 'Cities', schema: CitiesSchema }])],
  providers: [CitiesService],
})
export class CitiesModule {};