import { ObjectId } from 'mongodb';

export const matchToRegex = (match: any) => Object.keys(match).reduce((acc, cur) => ({
    ...acc,
    ...(
      match[cur]
        ? { [cur]: { $regex: new RegExp(match[cur], 'i') } }
        : {}
    )
  }), {})

export const objectIdOrEmpty = (obj) => {
  const [[key, value]] = Object.entries(obj);

  return value ? { [key]: new ObjectId(value) } : {};
}
