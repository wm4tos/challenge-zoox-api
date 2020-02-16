import { ApiProperty } from '@nestjs/swagger';

export class StateDto {
  @ApiProperty()
  _id?: string;
  @ApiProperty()
  name?: string;
  @ApiProperty()
  UF?: string;
  @ApiProperty()
  cities?: Array<any>;
}