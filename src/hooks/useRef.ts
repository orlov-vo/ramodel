import { useMemo } from './useMemo';

export const useRef = <T>(initialValue: T) =>
  useMemo(
    () => ({
      current: initialValue,
    }),
    [],
  );
