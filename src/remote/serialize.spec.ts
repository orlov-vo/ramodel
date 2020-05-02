// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createInstance } from '../core/createInstance';
import { serialize } from './serialize';

type ExportId = number | string;

describe('serialize', () => {
  let exportCounter = 0;
  const exportedModels: WeakMap<object, ExportId> = new WeakMap();
  const getExportId = (instance: object) => {
    const cached = exportedModels.get(instance);

    if (cached != null) {
      return cached;
    }

    exportCounter += 1;
    exportedModels.set(instance, exportCounter);

    return exportCounter;
  };

  test('should serialize primitives', () => {
    const PRIMITIVES = [0, false, true, 1, 2.5, 'foo', null, undefined, 'bar'];

    const results = PRIMITIVES.map(i => serialize(i, { getExportId }));

    results.forEach((item, index) => {
      expect(item).toBe(PRIMITIVES[index]);
    });
  });

  test('should serialize objects', () => {
    const original = { foo: 'bar' };
    const result = serialize(original, { getExportId });

    expect(result).toEqual(original);
  });

  test('should serialize arrays', () => {
    const original = ['foo', 'bar'];
    const result = serialize(original, { getExportId });

    expect(result).toEqual(original);
  });

  test('should serialize functions', () => {
    const fn = (a: number, b: number) => `${a} + ${b}`;
    const result = serialize(fn, { getExportId });

    expect(result).toEqual({
      ramodel: 'EXPORT_FUNCTION',
      exportId: exportCounter,
      length: 2,
    });
  });

  test('should serialize models', () => {
    const instance = createInstance({}, () => ({ foo: (a: number, b: number) => `${a} + ${b}`, bar: 'test' }));
    const result = serialize(instance, { getExportId });

    expect(result).toEqual({
      ramodel: 'EXPORT_MODEL',
      exportId: exportCounter,
      result: {
        foo: {
          ramodel: 'EXPORT_FUNCTION',
          exportId: exportCounter - 1,
          length: 2,
        },
        bar: 'test',
      },
    });
  });
});
