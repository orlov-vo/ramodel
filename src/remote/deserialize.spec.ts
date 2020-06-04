// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { deserialize } from './deserialize';

describe('deserialize', () => {
  let handleFunction = jest.fn((exportId, { length, content }) => ({ exportId, length, content }));
  let handleModel = jest.fn((exportId, result) => ({ exportId, result }));
  const deser = (i: unknown) => deserialize(i, { handleFunction, handleModel });

  test.each([0, false, true, 1, 2.5, 'foo', null, undefined, '', 'bar'].map(i => [i]))(
    'should deserialize primitives',
    input => {
      const result = deser(input);

      expect(result).toBe(input);
    },
  );

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
    handleFunction = jest.fn((exportId, { length, content }) => ({ exportId, length, content }));
    handleModel = jest.fn((exportId, result) => ({ exportId, result }));

    const result = deser({
      ramodel: 'EXPORT_MODEL',
      exportId: 2,
      result: {
        foo: {
          ramodel: 'EXPORT_FUNCTION',
          exportId: 1,
          length: 2,
          content: '(a, b) => a + b',
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
          content: '(a, b) => a + b',
        },
        bar: 'test',
      },
    });
  });
});
