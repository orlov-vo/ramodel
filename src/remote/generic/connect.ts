// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { createModel, update } from '../../core/mod';
import { onDestroy } from '../../core/destroy';
import { RemoteWorld } from '../RemoteWorld';
import { deserialize } from '../deserialize';
import { GET_MODEL, CALL_FUNCTION, SUBSCRIBE_UPDATES } from '../constants';
import type { Message, QueryMessage, ErrorMessage } from './typings';

class RemoteModel extends createModel(data => data) {}

type ExportId = number | string;
type Resolver = (value: any) => void;

type PostMessageFn<T extends string, Q = any, P = any, E = any> = (
  msg: Message<T, Q, P> | QueryMessage<T, Q> | ErrorMessage<T, Q, E>,
) => void;

type OnInit = (init: { onMessage: (message: Message<string>) => void }) => void;

export function connect({ postMessage, onInit }: { postMessage: PostMessageFn<string>; onInit: OnInit }) {
  const gettingModelResolvers: Record<string, Resolver> = {};
  const callsFunctionsResolvers: Map<ExportId, Resolver> = new Map();

  const importedModels: Map<ExportId, RemoteModel> = new Map();
  const importedModelsExportIds: WeakMap<RemoteModel, ExportId> = new WeakMap();

  const importedFunctions: Map<ExportId, Function> = new Map();
  const importedFunctionIds: WeakMap<Function, ExportId> = new WeakMap();

  onDestroy('model', model => {
    const exportId = importedModelsExportIds.get(model);
    if (exportId == null) return;
    importedModels.delete(exportId);
  });

  onDestroy('function', fn => {
    const exportId = importedFunctionIds.get(fn);
    if (exportId == null) return;
    importedFunctions.delete(exportId);
  });

  const deserializeOptions = {
    handleModel: (exportId: ExportId, data: object) => {
      const instance = importedModels.get(exportId);

      if (instance) {
        return instance;
      }

      const newInstance = new RemoteModel(data);
      importedModels.set(exportId, newInstance);
      importedModelsExportIds.set(newInstance, exportId);

      postMessage({
        type: SUBSCRIBE_UPDATES,
        query: exportId,
      });

      return newInstance;
    },
    handleFunction: (exportId: ExportId, { content }: { length: number; content: string }) => {
      const importedFn = importedFunctions.get(exportId);
      if (importedFn) {
        return importedFn;
      }

      const fn = (...args: unknown[]) =>
        new Promise(resolve => {
          if (callsFunctionsResolvers.has(exportId)) {
            console.error('There is detected unhandled resolve method for calling function');
          }

          callsFunctionsResolvers.set(exportId, resolve);
          postMessage({
            type: CALL_FUNCTION,
            query: exportId,
            payload: args,
          });
        });

      fn.toString = () => content;

      importedFunctions.set(exportId, fn);

      return fn;
    },
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

  onInit({
    onMessage: (message: Message<string> | ErrorMessage<string>) => {
      const { type } = message;

      if ('error' in message) {
        const { error } = message;
        throw new Error(`Error on ${type}: ${error ? error.message : 'Unknown error value'}`);
      }

      const handler = messageHandlers[type as keyof typeof messageHandlers];
      if (!handler) return;

      handler(message as any);
    },
  });

  const remoteWorld = new RemoteWorld({
    onLoad: modelName =>
      new Promise(resolve => {
        if (gettingModelResolvers[modelName] != null) {
          console.error('There is detected unhandled resolve method for getting model');
        }

        gettingModelResolvers[modelName] = resolve;
        postMessage({
          type: GET_MODEL,
          query: modelName,
        });
      }),
  });

  return remoteWorld;
}
