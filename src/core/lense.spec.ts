import { createModel } from './createModel';
import { makeLense } from './lense';

const createInstance = <Init extends object, Public extends object>(mainFn: (init: Init) => Public, init: Init) =>
  new (createModel(mainFn))(init);

describe('makeLense', () => {
  it('should return result', () => {
    const instance = createInstance(() => ({ foo: 'bar' }), {});
    const lense = makeLense(instance, _ => _.foo);

    expect(lense().result).toBe('bar');
  });
  it('should return models list', () => {});
});
