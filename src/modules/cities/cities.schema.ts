import { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface CitiesDocument extends Document {
  _id: ObjectId;
  name: string;
  state: ObjectId;
}

export const CitiesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: ObjectId,
    required: true,
  },
});