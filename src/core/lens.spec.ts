// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createInstance } from './createInstance';
import { createLens } from './lens';

describe('createLens', () => {
  it('should return result', () => {
    const instance = createInstance({}, () => ({ foo: 'bar' }));
    const lens = createLens(instance, _ => _.foo);

    expect(lens().result).toBe('bar');
  });
  it('should return models list', () => {});
});
