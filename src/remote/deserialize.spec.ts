// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { deserialize } from './deserialize';

describe('deserialize', () => {
  let handleFunction = jest.fn((exportId, length) => ({ exportId, length }));
  let handleModel = jest.fn((exportId, result) => ({ exportId, result }));
  const deser = (i: unknown) => deserialize(i, { handleFunction, handleModel });

  test('should deserialize primitives', () => {
    const PRIMITIVES = [0, false, true, 1, 2.5, 'foo', null, undefined, 'bar'];

    const results = PRIMITIVES.map(deser);

    results.forEach((item, index) => {
      expect(item).toBe(PRIMITIVES[index]);
    });
  });

  test('should deserialize objects', () => {
    const original = { foo: 'bar' };
    const result = deser(original);

    expect(result).toEqual(original);
  });

  test('should deserialize arrays', () => {
    const original = ['foo', 'bar'];
    const result = deser(original);

    expect(result).toEqual(original);
  });

  test('should deserialize functions', () => {
    const result = deser({
      ramodel: 'EXPORT_FUNCTION',
      exportId: 1,
      length: 2,
    });

    expect(handleFunction).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      exportId: 1,
      length: 2,
    });
  });

  test('should deserialize models', () => {
    handleFunction = jest.fn((exportId, length) => ({ exportId, length }));
    handleModel = jest.fn((exportId, result) => ({ exportId, result }));

    const result = deser({
      ramodel: 'EXPORT_MODEL',
      exportId: 2,
      result: {
        foo: {
          ramodel: 'EXPORT_FUNCTION',
          exportId: 1,
          length: 2,
        },
        bar: 'test',
      },
    });

    expect(handleModel).toHaveBeenCalledTimes(1);
    expect(handleFunction).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      exportId: 2,
      result: {
        foo: {
          exportId: 1,
          length: 2,
        },
        bar: 'test',
      },
    });
  });
});
