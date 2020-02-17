import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesSchema } from './cities.schema';

@Module({
  controllers: [],
  imports: [MongooseModule.forFeature([{ name: 'Cities', schema: CitiesSchema }])],
  providers: [],
})
export class CitiesModule {};