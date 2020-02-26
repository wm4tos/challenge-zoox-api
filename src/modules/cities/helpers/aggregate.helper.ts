import { ObjectId } from 'mongodb';

export const generateAggregation = ({ _id, ...match }: any): any[] => ([
  { $match: _id ? { _id: new ObjectId(_id), ...match } : (match || {}) },
  {
    $lookup: {
      from: 'states',
      localField: 'state',
      foreignField: '_id',
      as: 'state',
    },
  },
  {
    $project: {
      'state.__v': 0,
      '__v': 0,
    },
  },
  {
    $unwind: '$state',
  },
]);
