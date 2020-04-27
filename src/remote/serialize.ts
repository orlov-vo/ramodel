import { RESULT } from '../core/symbols';
import { isModel } from '../core/isModel';

const EXPORT_MODEL = 'EXPORT_MODEL' as const;
const EXPORT_FUNCTION = 'EXPORT_FUNCTION' as const;

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

      return {
        ramodel: EXPORT_MODEL,
        exportId: getExportId(data),
        result: updateValuesInObject(data[RESULT], item => serialize(item, options)),
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
    };
  }

  return data;
}
