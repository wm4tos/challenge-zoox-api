export function itemIterator<T> (condition: object) {
  return (item: T): boolean => {
    if (!condition || !Object.keys(condition).length) return true;

    const entries = Object.entries(condition);

    return entries
      .reduce((acc: Array<boolean>, [key, value]) => acc.concat(item[key] === value), [])
      .some(item => item);
  };
}

export function iterator<T> (method: string) {
  return (items: T[]) => (query: any): any|any[] => {
    return items[method](itemIterator<T>(query));
  };
}

export function add<T> (items: T[]) {
  return (item: T): T[] => items.concat(item);
}

export function remove<T> (items: T[]) {
  return (condition: object): T[] => {
    const index = iterator('findIndex')(items)(condition);

    items.splice(index, 1);

    return items;
  };
}

export function update<T> (items: T[]) {
  return (condition: object, data: T): T[] => {
    const item = iterator<T>('find')(items)(condition);
    const index = iterator<T>('filter')(items)(condition);
    
    items.splice(index, 1, { ...item, ...data });

    return items;
  };
}
