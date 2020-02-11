import { ObjectId } from 'mongodb';

export interface Payload {
  _id: ObjectId;
  name: string;
  email: string;
}