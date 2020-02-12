import { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface UserDocument extends Document {
  id: ObjectId;
  name: string;
  email: string;
  password: string;
}

export const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
});