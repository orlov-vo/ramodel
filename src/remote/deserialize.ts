// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { isObject } from '../core/isObject';
import { EXPORT_MODEL, EXPORT_FUNCTION } from './constants';

function updateValuesInObject(obj: object, modificator: (value: unknown) => unknown): object {
  return Object.keys(obj).reduce((acc, key) => {
    // @ts-ignore
    acc[key] = modificator(obj[key]);
    return acc;
  }, {});
}

type ExportId = number | string;

type ExportedModel<TData = unknown> = {
  ramode: typeof EXPORT_MODEL;
  exportId: ExportId;
  result: TData;
};

function isExportedModel(instance: unknown): instance is ExportedModel<object> {
  return isObject(instance) && (instance as any).ramodel === EXPORT_MODEL;
}

type ExportedFunction = {
  ramode: typeof EXPORT_FUNCTION;
  exportId: ExportId;
  length: number;
  content: string;
};

function isExportedFunction(instance: unknown): instance is ExportedFunction {
  return isObject(instance) && (instance as any).ramodel === EXPORT_FUNCTION;
}

type DeserializeOptions = {
  handleModel: (exportId: ExportId, data: object) => unknown;
  handleFunction: (exportId: ExportId, data: { length: number; content: string }) => unknown;
};

export function deserialize(data: unknown, options: DeserializeOptions): unknown {
  if (isExportedModel(data)) {
    const { handleModel } = options;

    return handleModel(data.exportId, deserialize(data.result, options) as object);
  }

  if (isExportedFunction(data)) {
    const { handleFunction } = options;

    return handleFunction(data.exportId, { length: data.length, content: data.content });
  }

  if (Array.isArray(data)) {
    return data.map(item => deserialize(item, options));
  }

  if (isObject(data)) {
    return updateValuesInObject(data, item => deserialize(item, options));
  }

  return data;
}
