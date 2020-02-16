import { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface StateDocument extends Document {
  _id: ObjectId;
  name: string;
  UF: string;
  cities: Array<ObjectId>;
}

export const StateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  UF: {
    type: String,
    required: true,
    unique: true,
  },
  cities: Array,
});