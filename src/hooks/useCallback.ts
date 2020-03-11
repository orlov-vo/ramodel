import { useMemo } from './useMemo';

export const useCallback = <T extends Function>(fn: T, inputs: unknown[]) => useMemo(() => fn, inputs);
