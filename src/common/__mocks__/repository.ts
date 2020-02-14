import { add, update, iterator, remove } from '../helpers/test.helper';

export function MockRepository<T> (data: T[]): any {
  return (jest.fn(() => ({
    create: add<T>([].concat(data)),
    update: update<T>([].concat(data)),
    find: iterator('filter')([].concat(data)),
    findOne: iterator('find')([].concat(data)),
    delete: remove<T>([].concat(data)),
  })))();
}