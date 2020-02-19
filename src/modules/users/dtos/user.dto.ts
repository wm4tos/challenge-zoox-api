import { ObjectId } from 'mongodb';

export class UserDto {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
}