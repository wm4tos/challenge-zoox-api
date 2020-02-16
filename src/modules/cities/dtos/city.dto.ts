import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

import { StateDto } from 'src/modules/state/dtos/state.dto';

export class CityDto {
  @ApiProperty()
  _id?: string | ObjectId;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  state?: StateDto;
}