import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class StateDto {
  @ApiProperty()
  _id?: string | ObjectId;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  UF?: string;
  @ApiProperty()
  cities?: Array<any>;
}