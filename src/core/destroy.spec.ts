import { createInstance } from './createInstance';
import { destroy } from './destroy';
import { useState } from '../hooks/useState';

describe('destroy', () => {
  test('should does not call main function after destrou', () => {
    const mainFn = jest.fn(() => {
      const [state, setState] = useState(0);

      return { state, setState };
    });
    const instance = createInstance({}, mainFn);
    const { setState } = instance;

    expect(instance).toHaveProperty('state', 0);
    expect(instance).toHaveProperty('setState');

    destroy(instance);

    expect(instance).toHaveProperty('state', undefined);
    expect(instance).toHaveProperty('setState', undefined);
    expect(mainFn).toHaveBeenCalledTimes(1);

    setState(1);

    expect(instance).toHaveProperty('state', undefined);
    expect(instance).toHaveProperty('setState', undefined);
    expect(mainFn).toHaveBeenCalledTimes(1);
  });
});
