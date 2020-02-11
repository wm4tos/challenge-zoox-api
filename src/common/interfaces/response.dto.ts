export class ResponseDto {
  constructor(
    public sucess: boolean,
    public data: any,
    public message?: any,
    public errors?: any
  ) {}
}