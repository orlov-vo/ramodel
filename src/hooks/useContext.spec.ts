import { createModel } from '../core/createModel';
import { createInstance } from '../core/createInstance';
import { createContext } from '../core/createContext';
import { update } from '../core/update';
import { useMemo } from './useMemo';
import { useContext } from './useContext';
import { useEffect } from './useEffect';

describe('useContext', () => {
  const Context = createContext('foo');

  const Model = createModel(() => {
    const value = useContext(Context);

    return { value };
  });

  test('provide default value from Context', () => {
    const instance = new Model({});

    expect(instance).toHaveProperty('value', 'foo');
  });

  test('provide new value via Context.withValue', () => {
    const instance = Context.withValue('bar', () => new Model({}));

    expect(instance).toHaveProperty('value', 'bar');
  });

  test('should update value via Context.updateValue', () => {
    const instance = Context.withValue('bar', () => new Model({}));

    expect(instance).toHaveProperty('value', 'bar');

    Context.updateValue(instance, 'baz');

    expect(instance).toHaveProperty('value', 'baz');
  });

  test('provide default value from Context in model', () => {
    const instance = createInstance({}, () => {
      const inner = useMemo(() => new Model({}), []);

      return { inner };
    });

    expect(instance).toHaveProperty('inner');
    expect(instance.inner).toHaveProperty('value', 'foo');
  });

  test('provide new value via Context.withValue in model', () => {
    const instance = createInstance({}, () => {
      const inner = useMemo(() => Context.withValue('bar', () => new Model({})), []);

      return { inner };
    });

    expect(instance).toHaveProperty('inner');
    expect(instance.inner).toHaveProperty('value', 'bar');
  });

  test('should update value via Context.updateValue in model', () => {
    const instance = createInstance({ isNeedUpdate: false }, ({ isNeedUpdate }) => {
      const inner = useMemo(() => Context.withValue('bar', () => new Model({})), []);
      useEffect(() => {
        if (isNeedUpdate) {
          Context.updateValue(inner, 'baz');
        }
      }, [isNeedUpdate]);

      return { inner };
    });

    expect(instance).toHaveProperty('inner');
    expect(instance.inner).toHaveProperty('value', 'bar');

    update(instance, { isNeedUpdate: true });

    expect(instance.inner).toHaveProperty('value', 'baz');
  });

  test('should update value deeply via Context.updateValue', () => {
    const instance = Context.withValue('bar', () =>
      createInstance({}, () => {
        const inner = useMemo(() => new Model({}), []);

        return { inner };
      }),
    );

    expect(instance).toHaveProperty('inner');
    expect(instance.inner).toHaveProperty('value', 'bar');

    Context.updateValue(instance, 'baz');

    expect(instance.inner).toHaveProperty('value', 'baz');
  });
});
