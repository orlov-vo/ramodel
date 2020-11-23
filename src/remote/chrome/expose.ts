// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { expose as genericExpose } from '../generic/mod';
import { LocalWorld } from '../LocalWorld';
import { PROTOCOL } from './constants';

type ChromeMessage<T> = { protocol: string; message: T; worldId: string };

export function expose(worldId = 'general'): LocalWorld {
  return genericExpose({
    onInit: ({ onMessage }) => {
      chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
        // Accept only local messages
        if (!sender || sender.origin !== globalThis.location.origin) return;

        if (typeof data !== 'object' || data == null) return;

        const { protocol, message, worldId: requestedWorldId } = data as ChromeMessage<any>;
        if (protocol !== PROTOCOL) return;
        if (worldId !== requestedWorldId) return;

        onMessage(message, sendResponse);
      });
    },
  });
}
