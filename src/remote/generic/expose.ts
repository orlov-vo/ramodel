// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { nanoid } from 'nanoid/non-secure';
import { EVENT_EMITTER } from '../../core/symbols';
import { EVENT_CHANGE } from '../../core/events';
import { BaseModel } from '../../core/types';
import { isModel } from '../../core/isModel';
import { onDestroy, destroy } from '../../core/destroy';
import { GET_MODEL, CALL_FUNCTION, SUBSCRIBE_UPDATES, UNSUBSCRIBE_UPDATES } from '../constants';
import { LocalWorld } from '../LocalWorld';
import { serialize } from '../serialize';

type ExportId = number | string;
type UnsubscribeFn = () => void;

type Message<T extends string, Q = any, P = any> = { type: T; query: Q; payload: P };
type ErrorMessage<T extends string, Q = any, E = any> = { type: T; query: Q; error: E };
type PostMessage<T extends string, Q = any, P = any, E = any> = (msg: Message<T, Q, P> | ErrorMessage<T, Q, E>) => void;

type GetModelOptions = { dwellers: Record<string, unknown>; getExportId: (instance: object) => ExportId };

const onGetModel = ({ dwellers, getExportId }: GetModelOptions) => (
  message: Message<typeof GET_MODEL, string, unknown>,
  postMessage: PostMessage<typeof GET_MODEL, string, unknown>,
) => {
  const { query } = message;
  const model = dwellers[query];

  if (model == null) {
    postMessage({
      type: GET_MODEL,
      query,
      error: { message: "Model isn't found" },
    });
    return;
  }

  postMessage({
    type: GET_MODEL,
    query,
    payload: serialize(model, { getExportId }),
  });
};

type CallFunctionOptions = {
  getExportedFunction: (id: ExportId) => Function | void;
  getExportId: (instance: object) => ExportId;
};

const onCallFunction = ({ getExportedFunction, getExportId }: CallFunctionOptions) => async (
  message: Message<typeof CALL_FUNCTION, ExportId, unknown[]>,
  postMessage: PostMessage<typeof CALL_FUNCTION, ExportId, unknown>,
) => {
  const { query, payload } = message;

  const fn = getExportedFunction(query);
  if (!fn) {
    postMessage({
      type: CALL_FUNCTION,
      query,
      error: { message: "Function isn't found" },
    });
    return;
  }

  postMessage({
    type: CALL_FUNCTION,
    query,
    payload: serialize(await fn(...payload), { getExportId }),
  });
};

type SubscribeUpdatesOptions = {
  getExportedModel: (id: ExportId) => BaseModel | void;
  getExportId: (instance: object) => ExportId;
  registerUnsubscribe: (id: ExportId, unsubscribe: UnsubscribeFn) => void;
};

const onSubscribeUpdates = ({ getExportedModel, getExportId, registerUnsubscribe }: SubscribeUpdatesOptions) => (
  message: Message<typeof SUBSCRIBE_UPDATES, ExportId, unknown>,
  postMessage: PostMessage<typeof SUBSCRIBE_UPDATES, ExportId, unknown>,
) => {
  const { query } = message;

  const instance = getExportedModel(query);

  if (!instance) {
    postMessage({
      type: SUBSCRIBE_UPDATES,
      query,
      error: { message: "Model with this export id isn't found" },
    });
    return;
  }

  registerUnsubscribe(
    query,
    instance[EVENT_EMITTER].on(EVENT_CHANGE, result => {
      postMessage({
        type: SUBSCRIBE_UPDATES,
        query,
        payload: serialize(result, { getExportId }),
      });
    }),
  );
};

type UnsubscribeUpdatesOptions = {
  getUnsubscribe: (id: ExportId) => UnsubscribeFn | void;
  unregisterUnsubscribe: (id: ExportId) => void;
};

const onUnsubscribeUpdates = ({ getUnsubscribe, unregisterUnsubscribe }: UnsubscribeUpdatesOptions) => (
  message: Message<typeof SUBSCRIBE_UPDATES, ExportId, unknown>,
  postMessage: PostMessage<typeof UNSUBSCRIBE_UPDATES, ExportId, unknown>,
) => {
  const { query } = message;

  const unsubscribe = getUnsubscribe(query);

  if (!unsubscribe) {
    postMessage({
      type: UNSUBSCRIBE_UPDATES,
      query,
      error: { message: "Subscription with this export id isn't found" },
    });
    return;
  }

  unsubscribe();
  unregisterUnsubscribe(query);
};

type OnInit = (init: { onMessage: (message: Message<string>, postMessage: PostMessage<string>) => void }) => void;

export function expose({ onInit }: { onInit: OnInit }): LocalWorld {
  const localWorld = new LocalWorld({
    onSet: (exportName: string, _value: unknown) => {
      destroy(localWorld.dwellers[exportName]);
    },
  });

  const exportedModels: Map<ExportId, BaseModel> = new Map();
  const exportedFunctions: Map<ExportId, Function> = new Map();
  const unsubscribes: Map<ExportId, UnsubscribeFn> = new Map();

  const exportedInstances: WeakMap<object, ExportId> = new WeakMap();

  onDestroy('model', model => {
    const exportId = exportedInstances.get(model);
    if (exportId == null) return;
    exportedModels.delete(exportId);
  });

  onDestroy('function', model => {
    const exportId = exportedInstances.get(model);
    if (exportId == null) return;
    exportedFunctions.delete(exportId);
    // TODO: need to call unsubscribe here?
    unsubscribes.delete(exportId);
  });

  const getExportId = (instance: object) => {
    const cached = exportedInstances.get(instance);

    if (cached != null) {
      return cached;
    }

    const id = nanoid();
    exportedInstances.set(instance, id);

    if (typeof instance === 'function') {
      exportedFunctions.set(id, instance);
    } else if (isModel(instance)) {
      exportedModels.set(id, instance);
    }

    return id;
  };

  const messageHandlers = {
    [GET_MODEL]: onGetModel({ dwellers: localWorld.dwellers, getExportId }),
    [CALL_FUNCTION]: onCallFunction({ getExportedFunction: id => exportedFunctions.get(id), getExportId }),
    [SUBSCRIBE_UPDATES]: onSubscribeUpdates({
      getExportedModel: id => exportedModels.get(id),
      getExportId,
      registerUnsubscribe: (id, unsubscribe) => unsubscribes.set(id, unsubscribe),
    }),
    [UNSUBSCRIBE_UPDATES]: onUnsubscribeUpdates({
      getUnsubscribe: id => unsubscribes.get(id),
      unregisterUnsubscribe: id => unsubscribes.delete(id),
    }),
  } as const;

  onInit({
    onMessage: (message: Message<string>, postMessage: PostMessage<string>): void => {
      const { type } = message;

      const handler = messageHandlers[type as keyof typeof messageHandlers];
      if (!handler) return;

      handler(message as any, postMessage);
    },
  });

  return localWorld;
}
