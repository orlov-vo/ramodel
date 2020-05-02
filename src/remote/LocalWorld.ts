// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { onDestroy } from '../core/destroy';

type Options = {
  onSet?: (exportName: string, value: unknown) => void;
};

export class LocalWorld {
  options: Options;

  dwellers: Record<string, unknown> = {};

  constructor(options: Options = {}) {
    this.options = options;
  }

  set(exportName: string, value: unknown): this {
    if (typeof this.options.onSet === 'function') {
      this.options.onSet(exportName, value);
    }

    this.dwellers[exportName] = value;

    const remove = (instance: unknown) => {
      if (instance !== value) return;
      delete this.dwellers[exportName];
    };

    onDestroy('function', remove);
    onDestroy('model', remove);
    onDestroy('array', remove);
    onDestroy('object', remove);

    return this;
  }
}
