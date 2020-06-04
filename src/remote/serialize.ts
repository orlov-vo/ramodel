// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { RESULT, SCHEDULER } from '../core/symbols';
import { isModel } from '../core/isModel';
import { EXPORT_MODEL, EXPORT_FUNCTION } from './constants';

function updateValuesInObject(obj: object, modificator: (value: unknown) => unknown): object {
  return Object.keys(obj).reduce((acc, key) => {
    // @ts-ignore
    acc[key] = modificator(obj[key]);
    return acc;
  }, {});
}

type ExportId = number | string;
type SerializeOptions = {
  getExportId: (instance: object) => ExportId;
};

export function serialize(data: unknown, options: SerializeOptions): unknown {
  if (Array.isArray(data)) {
    return data.map(item => serialize(item, options));
  }

  if (typeof data === 'object' && data != null) {
    if (isModel(data)) {
      const { getExportId } = options;
      const scheduler = data[SCHEDULER];

      if (scheduler == null) {
        throw new Error("Couldn't serialize destoyed model instance");
      }

      scheduler.flush();
      const result = updateValuesInObject(data[RESULT], item => serialize(item, options));

      return {
        ramodel: EXPORT_MODEL,
        exportId: getExportId(data),
        result,
      };
    }

    return updateValuesInObject(data, item => serialize(item, options));
  }

  if (typeof data === 'function') {
    const { getExportId } = options;

    return {
      ramodel: EXPORT_FUNCTION,
      exportId: getExportId(data),
      length: data.length,
      content: data.toString(),
    };
  }

  return data;
}
