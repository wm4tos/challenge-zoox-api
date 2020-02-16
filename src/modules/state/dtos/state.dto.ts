import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

import { CityDto } from 'src/modules/cities/dtos/city.dto';

export class StateDto {
  @ApiProperty()
  _id?: string | ObjectId;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  UF?: string;
  @ApiProperty()
  cities?: Array<CityDto>;
}