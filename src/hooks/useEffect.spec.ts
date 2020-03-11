import { createModel } from '../core/createModel';
import { useState } from './useState';
import { useEffect } from './useEffect';

const createInstance = <Init, Public extends object>(mainFn: (init: Init) => Public, init: Init) =>
  new (createModel(mainFn))(init);

describe('useState', () => {
  test('should accept initial state', () => {
    const timer = createInstance(() => {
      const [time, setTime] = useState(0);

      useEffect(() => {
        const timerId = setInterval(() => {
          setTime(i => i + 1);
        }, 1000);

        return () => {
          clearInterval(timerId);
        };
      }, []);

      return {
        time,
      };
    }, null);
  });
});
