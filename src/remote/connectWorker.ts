import { RemoteWorld } from './RemoteWorld';
import { deserialize } from './deserialize';
import { createModel, update } from '../core/mod';
import { GET_MODEL, CALL_FUNCTION, SUBSCRIBE_UPDATES } from './constants';

const RemoteModel = createModel(data => data);

type ExportId = number | string;
type Resolver = (value: any) => void;

type Message<T extends string, Q, P> = { type: T; query: Q; payload: P };

// TODO: need to add ability to use SharedWorker here also
// @see https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
export function connectWorker(worker: Worker) {
  const gettingModelResolvers: Record<string, Resolver> = {};
  const callsFunctionsResolvers: Map<ExportId, Resolver> = new Map();

  // TODO: on destroy remove updates and unsubscribe
  const importedModels = new Map();

  const deserializeOptions = {
    handleModel: (exportId: ExportId, data: object) => {
      const instance = importedModels.get(exportId);

      if (instance) {
        return instance;
      }

      const newInstance = new RemoteModel(data);
      importedModels.set(exportId, newInstance);

      worker.postMessage({
        type: SUBSCRIBE_UPDATES,
        query: exportId,
      });

      return newInstance;
    },
    handleFunction: (exportId: ExportId, _length: number) => (...args: unknown[]) =>
      new Promise(resolve => {
        if (callsFunctionsResolvers.has(exportId)) {
          console.error('There is detected unhandled resolve method for calling function');
        }

        callsFunctionsResolvers.set(exportId, resolve);
        worker.postMessage({
          type: CALL_FUNCTION,
          query: exportId,
          payload: args,
        });
      }),
  };

  const onGetModel = (message: Message<typeof GET_MODEL, string, object>) => {
    const { query, payload } = message;
    if (query == null) return;

    const resolveGetModel = gettingModelResolvers[query];
    if (resolveGetModel == null) return;

    resolveGetModel(deserialize(payload, deserializeOptions));
    delete gettingModelResolvers[query];
  };

  const onCallFunction = (message: Message<typeof CALL_FUNCTION, number, object>) => {
    const { query, payload } = message;
    if (query == null) return;

    const resolve = callsFunctionsResolvers.get(query);
    if (resolve == null) return;

    resolve(deserialize(payload, deserializeOptions));
    callsFunctionsResolvers.delete(query);
  };

  const onSubscribeUpdates = (message: Message<typeof SUBSCRIBE_UPDATES, ExportId, object>) => {
    const { query, payload } = message;
    if (query == null) return;

    const instance = importedModels.get(query);
    if (instance == null) return;

    update(instance, deserialize(payload, deserializeOptions) as object);
  };

  const messageHandlers = {
    [GET_MODEL]: onGetModel,
    [CALL_FUNCTION]: onCallFunction,
    [SUBSCRIBE_UPDATES]: onSubscribeUpdates,
  } as const;

  worker.addEventListener('message', event => {
    const { type, error } = event.data;

    if (error) {
      throw new Error(`Error on ${type}: ${error.message}`);
    }

    const handler = messageHandlers[type as keyof typeof messageHandlers];
    if (!handler) return;

    handler(event.data as any);
  });

  const remoteWorld = new RemoteWorld({
    onLoad: modelName =>
      new Promise(resolve => {
        if (gettingModelResolvers[modelName] != null) {
          console.error('There is detected unhandled resolve method for getting model');
        }

        gettingModelResolvers[modelName] = resolve;
        worker.postMessage({
          type: GET_MODEL,
          query: modelName,
        });
      }),
  });

  return remoteWorld;
}
