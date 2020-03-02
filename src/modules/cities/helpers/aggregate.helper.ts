import { matchToRegex, objectIdOrEmpty } from 'src/common/helpers/aggregate.helper';

export const generateAggregation = ({ _id, state, ...match }: any): any[] => ([
  {
    $match: Object.assign(
      objectIdOrEmpty({ _id }),
      objectIdOrEmpty({ state }),
      matchToRegex(match),
    ),
  },
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
