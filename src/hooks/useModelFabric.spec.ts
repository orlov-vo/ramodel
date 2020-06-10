// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createModel } from '../core/createModel';
import { createInstance } from '../core/createInstance';
import { createContext } from '../core/createContext';
import { useModelFabric } from './useModelFabric';
import { useState } from './useState';
import { useMemo } from './useMemo';
import { useContext } from './useContext';

describe('useModelFabric', () => {
  test('should create new model instance', async () => {
    const Foo = createModel(props => props);

    const instance = createInstance({}, () => {
      const createFoo = useModelFabric(Foo);
      const a = createFoo({ name: 'a' });
      const b = createFoo({ name: 'b' });
      const c = createFoo();

      return { a, b, c };
    });

    expect(instance).toHaveProperty('a');
    expect(instance).toHaveProperty('b');
    expect(instance).toHaveProperty('c');
    expect(instance.a).toHaveProperty('name', 'a');
    expect(instance.b).toHaveProperty('name', 'b');
  });

  test.todo('should update input in model instance');

  test.todo('should destroy instance');

  test('should provide context', () => {
    const Context = createContext('foo');
    const Foo = createModel(() => ({ foo: useContext(Context) }));

    const instance = createInstance({}, () => {
      const createFoo = useModelFabric(Foo, {
        contexts: [[Context, 'bar']],
      });
      const child = useMemo(createFoo, []);

      return { child };
    });

    expect(instance).toHaveProperty('child');
    expect(instance.child).toHaveProperty('foo', 'bar');
  });

  test('should update context values', () => {
    const Context = createContext('foo');
    const Foo = createModel(() => ({ foo: useContext(Context) }));

    const instance = createInstance({}, () => {
      const [foo, setValue] = useState('bar');
      const createFoo = useModelFabric(Foo, {
        contexts: [[Context, foo]],
      });
      const child = useMemo(createFoo, []);

      return { child, setValue };
    });

    expect(instance).toHaveProperty('child');
    expect(instance.child).toHaveProperty('foo', 'bar');

    instance.setValue('baz');

    const value = instance.child.foo;

    expect(value).toEqual('baz');
  });

  test('should detach context values from instance', () => {
    const Context = createContext('foo');
    const Foo = createModel(() => ({ foo: useContext(Context) }));

    const instance = createInstance({}, () => {
      const [foo, setValue] = useState('bar');
      const createFoo = useModelFabric(Foo, {
        contexts: foo ? [[Context, foo]] : [],
      });
      const child = useMemo(createFoo, []);

      return { child, setValue };
    });

    expect(instance).toHaveProperty('child');
    expect(instance.child).toHaveProperty('foo', 'bar');

    instance.setValue('');

    expect(instance.child).toHaveProperty('foo', 'foo');
  });
});
