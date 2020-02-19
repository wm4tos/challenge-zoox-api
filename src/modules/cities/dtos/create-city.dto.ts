import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class CreateCityDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  state: ObjectId;
}