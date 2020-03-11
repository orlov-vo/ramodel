import { createModel } from './createModel';

const createInstance = <Init, Public extends object>(mainFn: (init: Init) => Public, init: Init) =>
  new (createModel(mainFn))(init);

describe('createModel', () => {
  test('init empty model', () => {
    const init = 'test';
    const mainFn = jest.fn(() => ({}));
    const instance = createInstance(mainFn, init);

    // Micro-hack to flush all tasks via read state
    ((() => {}) as any)((instance as any).foo);

    expect(mainFn).toHaveBeenCalledTimes(1);
    expect(mainFn).toHaveBeenCalledWith(init);
  });

  test('init model with static fields', () => {
    const mainFn = jest.fn(init => ({ init, foo: 'bar' }));
    const instance = createInstance(mainFn, 'test');

    expect(instance).toHaveProperty('init', 'test');
    expect(instance).toHaveProperty('foo', 'bar');

    expect(mainFn).toHaveBeenCalledTimes(1);
  });
});
