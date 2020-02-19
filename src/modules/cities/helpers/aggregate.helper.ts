import { ObjectId } from 'mongodb';

export const generateAggregation = ({ _id, ...match }: any) => ([
  { $match: { _id: new ObjectId(_id), ...match } },
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
      'state.cities': 0,
      'state.__v': 0,
      '__v': 0,
    },
  },
  {
    $unwind: '$state',
  },
]);
