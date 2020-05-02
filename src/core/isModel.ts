// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { BaseModel } from './types';
import { SCHEDULER } from './symbols';

export function isModel(instance: unknown): instance is BaseModel {
  return typeof instance === 'object' && instance != null && (instance as any)[SCHEDULER] != null;
}
