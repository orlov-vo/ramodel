type Options = {
  onLoad: <T>(modelName: string) => Promise<T>;
};

export class RemoteWorld {
  options: Options;

  models: Record<string, unknown> = {};

  constructor(options: Options) {
    this.options = options;
  }

  // TODO: need wrap result of functions in T to Promise<...>
  async get<T>(modelName: string): Promise<T> {
    if (this.models[modelName]) {
      return this.models[modelName] as T;
    }

    const model: T = await this.options.onLoad(modelName);
    this.models[modelName] = model;

    return model;
  }
}
