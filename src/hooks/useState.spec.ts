import { createModel } from '../core/createModel';
import { useState } from './useState';

const createInstance = <Init, Public extends object>(mainFn: (init: Init) => Public, init: Init) =>
  new (createModel(mainFn))(init);

describe('useState', () => {
  test('should accept initial state', () => {
    const instance = createInstance(() => {
      const [value] = useState('foo');
      return { value };
    }, null);

    expect(instance).toHaveProperty('value', 'foo');
  });

  test('should able to update value in state', () => {
    const instance = createInstance(() => {
      const [value, setValue] = useState('foo');
      return { value, setValue };
    }, null);

    expect(instance).toHaveProperty('value', 'foo');
    expect(instance).toHaveProperty('setValue');
    instance.setValue('bar');
    expect(instance).toHaveProperty('value', 'bar');
  });
});
