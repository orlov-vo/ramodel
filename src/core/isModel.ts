// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { BaseModel } from './types';
import { SCHEDULER } from './symbols';
import { isObject } from './isObject';

export function isModel(instance: unknown): instance is BaseModel {
  return isObject(instance) && (instance as any)[SCHEDULER] != null;
}
