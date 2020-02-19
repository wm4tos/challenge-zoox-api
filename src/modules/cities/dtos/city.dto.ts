import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty()
  _id?: string | ObjectId;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  state?: ObjectId;
}