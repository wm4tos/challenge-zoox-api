import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty({
    required: false,
  })
  _id?: string | ObjectId;
  @ApiProperty({
    required: false,
  })
  name?: string;
  @ApiProperty({
    required: false,
  })
  state?: ObjectId;
}