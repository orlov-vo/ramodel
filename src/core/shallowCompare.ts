export const shallowCompare = <A extends object, B extends object>(a: A, b: B) =>
  Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => (a as any)[key] === (b as any)[key]);
