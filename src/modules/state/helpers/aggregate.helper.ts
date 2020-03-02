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
      'cities.state': 0,
    },
  },
]);
