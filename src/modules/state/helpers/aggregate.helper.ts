import { ObjectId } from 'mongodb';

export const generateAggregation = ({ _id, ...match }: any) => ([
  { $match: _id ? { _id: new ObjectId(_id), ...match } : (match || {}) },
  {
    $lookup: {
      from: 'cities',
      localField: '_id',
      foreignField: 'state',
      as: 'cities',
    },
  },
  {
    $project: {
      'cities.__v': 0,
      '__v': 0,
    },
  },
]);
