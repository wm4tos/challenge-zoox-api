import { ObjectId } from 'mongodb';

export class User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
}