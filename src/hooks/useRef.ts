// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { useMemo } from './useMemo';

export const useRef = <T>(initialValue: T) =>
  useMemo(
    () => ({
      current: initialValue,
    }),
    [],
  );
