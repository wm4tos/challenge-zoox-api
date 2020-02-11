import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({ type: Boolean })
  public sucess: boolean;
  @ApiProperty()
  public data: any;
  @ApiProperty()
  public message?: any;
  @ApiProperty()
  public errors?: any;

  constructor(
    sucess: boolean,
    data: any,
    message?: any,
    errors?: any
  ) {
    this.sucess = sucess;
    this.data = data;
    this.message = message;
    this.errors = errors;
  }
}