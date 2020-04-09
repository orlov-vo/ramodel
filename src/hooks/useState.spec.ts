import { createInstance } from '../core/createInstance';
import { useState } from './useState';

describe('useState', () => {
  test('should accept initial state', () => {
    const instance = createInstance({}, () => {
      const [value] = useState('foo');
      return { value };
    });

    expect(instance).toHaveProperty('value', 'foo');
  });

  test('should able to update value in state', () => {
    const instance = createInstance({}, () => {
      const [value, setValue] = useState('foo');
      return { value, setValue };
    });

    expect(instance).toHaveProperty('value', 'foo');
    expect(instance).toHaveProperty('setValue');
    instance.setValue('bar');
    expect(instance).toHaveProperty('value', 'bar');
  });
});
