export function itemIterator<T> (condition: object) {
  return (item: T): boolean => {
    if (!Object.keys(condition).length) return true;

    const entries = Object.entries(condition);

    return entries
      .reduce((acc: Array<boolean>, [key, value]) => acc.concat(item[key] === value), [])
      .some(item => !item);
  };
}

export function iterator<T> (items: T[]) {
  return (method = 'filter') => (condition: object): T|T[] =>
    items[method](itemIterator<T>(condition));
}

export function add<T> (items: T[]) {
  return (item: T): T[] => items.concat(item);
}

export function remove<T> (items: T[], indexFinder: Function) {
  return (condition: object): T[] => {
    const index = indexFinder(condition);

    items.splice(index, 1);

    return items;
  };
}

export function update<T> (items: T[], itemFinder: Function, indexFinder: Function) {
  return (condition: object, data: T): T[] => {
    const item = itemFinder(condition);
    const index = indexFinder(condition);
    
    items.splice(index, 1, { ...item, ...data });

    return items;
  };
}
