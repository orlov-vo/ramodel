// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createModel } from '../core/createModel';
import { createInstance } from '../core/createInstance';
import { createContext } from '../core/createContext';
import { useModel } from './useModel';
import { useState } from './useState';
import { useContext } from './useContext';

describe('useModel', () => {
  test('should create new model instance', async () => {
    const Model = createModel(() => ({ foo: 'bar' }));

    const instance = createInstance({}, () => {
      const child = useModel(Model, { input: {} });
      return { child };
    });

    expect(instance).toHaveProperty('child');
    expect(instance.child).toHaveProperty('foo', 'bar');
  });

  test('should update input in model instance', async () => {
    const Model = createModel(({ foo }: { foo: string }) => ({ foo }));

    const instance = createInstance({}, () => {
      const [foo, setValue] = useState('bar');
      const child = useModel(Model, { input: { foo } });
      return { child, setValue };
    });

    expect(instance).toHaveProperty('child');
    expect(instance.child).toHaveProperty('foo', 'bar');

    instance.setValue('baz');

    const value = instance.child.foo;

    expect(value).toEqual('baz');
  });

  test.todo('should destroy instance');

  test('should provide context', () => {
    const Context = createContext('foo');
    const Model = createModel(() => ({ foo: useContext(Context) }));

    const instance = createInstance({}, () => {
      const child = useModel(Model, {
        input: {},
        contexts: [[Context, 'bar']],
      });
      return { child };
    });

    expect(instance).toHaveProperty('child');
    expect(instance.child).toHaveProperty('foo', 'bar');
  });

  test('should update context values', () => {
    const Context = createContext('foo');
    const Model = createModel(() => ({ foo: useContext(Context) }));

    const instance = createInstance({}, () => {
      const [foo, setValue] = useState('bar');
      const child = useModel(Model, {
        input: {},
        contexts: [[Context, foo]],
      });
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
    const Model = createModel(() => ({ foo: useContext(Context) }));

    const instance = createInstance({}, () => {
      const [foo, setValue] = useState('bar');
      const child = useModel(Model, {
        input: {},
        contexts: foo ? [[Context, foo]] : [],
      });
      return { child, setValue };
    });

    expect(instance).toHaveProperty('child');
    expect(instance.child).toHaveProperty('foo', 'bar');

    instance.setValue('');

    expect(instance.child).toHaveProperty('foo', 'foo');
  });
});
