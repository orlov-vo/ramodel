import { createInstance } from './createInstance';
import { makeLense } from './lense';

describe('makeLense', () => {
  it('should return result', () => {
    const instance = createInstance({}, () => ({ foo: 'bar' }));
    const lense = makeLense(instance, _ => _.foo);

    expect(lense().result).toBe('bar');
  });
  it('should return models list', () => {});
});
