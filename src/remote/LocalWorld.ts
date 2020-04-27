type Options = {
  onSet?: (exportName: string, value: unknown) => void;
};

export class LocalWorld {
  options: Options;

  models: Record<string, unknown> = {};

  constructor(options: Options = {}) {
    this.options = options;
  }

  set(exportName: string, value: unknown): this {
    if (typeof this.options.onSet === 'function') {
      this.options.onSet(exportName, value);
    }

    // TODO: need remove model from the list on destroy
    this.models[exportName] = value;

    return this;
  }
}
