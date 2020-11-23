// Copyright 2020 the RaModel authors. All rights reserved. MIT license.

import { connect as genericConnect, Message } from '../generic/mod';
import { RemoteWorld } from '../RemoteWorld';
import { PROTOCOL } from './constants';

export function connect(worldId = 'general'): RemoteWorld {
  let messageHandler: (message: Message<string>) => void;

  return genericConnect({
    postMessage: message => {
      const payload = { protocol: PROTOCOL, worldId, message };

      const error = new Error('Chrome runtime message occurred');
      chrome.runtime.sendMessage(payload, data => {
        const { lastError } = chrome.runtime;
        if (lastError) {
          if (lastError.message) {
            error.message = lastError.message;
          }
          throw error;
        }

        messageHandler(data);
      });
    },
    onInit: ({ onMessage }) => {
      messageHandler = onMessage;
    },
  });
}
