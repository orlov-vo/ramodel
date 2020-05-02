import { hook, Hook } from '../core/hook';
import { State } from '../core/state';
import { Context } from '../core/createContext';
import { CONTEXTS, PARENT } from '../core/symbols';
import { BaseModel } from '../core/types';

export const useContext = hook(
  class ContextHook<T> extends Hook {
    context: Context<T>;

    constructor(id: number, state: State, context: Context<T>) {
      super(id, state);
      this.context = context;

      this.context.use(this.state.host as BaseModel);
    }

    update(context: Context<T>) {
      this.context = context;

      let host: BaseModel | null = this.state.host as BaseModel;

      while (host) {
        const contexts = host[CONTEXTS];
        if (contexts.has(this.context)) {
          return contexts.get(this.context);
        }

        host = host[PARENT];
      }

      return context.defaultValue;
    }
  },
);
