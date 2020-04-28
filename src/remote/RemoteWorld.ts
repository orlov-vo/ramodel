type Options = {
  onLoad: <T>(exportName: string) => Promise<T>;
};

export class RemoteWorld {
  options: Options;

  dwellers: Record<string, unknown> = {};

  constructor(options: Options) {
    this.options = options;
  }

  // TODO: need wrap result of functions in T to Promise<...>
  async get<T>(exportName: string): Promise<T> {
    if (this.dwellers[exportName]) {
      return this.dwellers[exportName] as T;
    }

    const model: T = await this.options.onLoad(exportName);
    this.dwellers[exportName] = model;

    return model;
  }
}
