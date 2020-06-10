// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

export const hasChanged = (values?: unknown[], oldValues?: unknown[]): boolean =>
  !values || !oldValues || values.length !== oldValues.length || values.some((value, i) => oldValues[i] !== value);
