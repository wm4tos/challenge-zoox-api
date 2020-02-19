import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { IsString, Length } from 'class-validator';

export class CreateCityDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  @Length(24, 24)
  state: ObjectId;
}