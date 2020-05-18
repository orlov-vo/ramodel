import { diff as differ, Diff } from 'deep-diff';
import cloneDeep from 'lodash.clonedeep';
import { createLens, watch } from '../core/mod';

type Record = {
  time: Date;
  prevState: unknown;
  nextState: unknown;
};

type Options = {
  name: string;
  logger: typeof console;
  timestamp: boolean;
  collapsed: boolean;
  diff: boolean;
  diffCollapsed: boolean;
  colors: {
    prevState: (prevState: unknown) => string;
    nextState: (nextState: unknown) => string;
  };
};

const DEFAULT_OPTIONS: Options = {
  name: '',
  logger: console,
  timestamp: true,
  collapsed: false,
  diff: false,
  diffCollapsed: true,
  colors: {
    prevState: (_prevState: unknown) => '#bfb04d',
    nextState: (_nextState: unknown) => '#4d80bf',
  },
} as const;

const pad = (value: unknown, length: number) => `${value}`.padStart(length, '0');

const formatTime = (time: Date) => {
  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const ms = time.getMilliseconds();

  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}.${pad(ms, 3)}`;
};

function processDiff(diff: Diff<unknown>): [string, [string, string], ...unknown[]] {
  const path = diff.path ? diff.path.join('.') : '';
  switch (diff.kind) {
    case 'E':
      return [path, ['CHANGED:', '#349aeb'], diff.lhs, '→', diff.rhs];
    case 'N':
      return [path, ['ADDED:', '#3ac93f'], diff.rhs];
    case 'D':
      return [path, ['DELETED:', '#d13f34']];
    case 'A': {
      const [itemPath, label, ...output] = processDiff(diff.item);
      return [`${path}[${diff.index}]${itemPath}`, label, ...output];
    }
    default:
      return [path, ['UNKNOWN:', '#7e19e3']];
  }
}

function logGroup(logger: typeof console, isCollapsed: boolean, name: string, ...args: unknown[]) {
  try {
    if (isCollapsed) {
      logger.groupCollapsed(name, ...args);
    } else {
      logger.group(name, ...args);
    }
  } catch (e) {
    logger.log(`START - ${name}`, ...args);
  }

  return () => {
    try {
      logger.groupEnd();
    } catch (e) {
      logger.log(`END - ${name}`, ...args);
    }
  };
}

function logDiff(prevState: unknown, newState: unknown, logger: typeof console, isCollapsed: boolean) {
  const diff = differ(prevState, newState);
  const closeGroup = logGroup(logger, isCollapsed, 'diff');

  if (diff) {
    diff.forEach(elem => {
      const [path, [text, color], ...output] = processDiff(elem);
      const style = `color: ${color}; font-weight: bold`;

      logger.log(`%c${text}`, style, path, ...output);
    });
  } else {
    logger.log('—— no diff ——');
  }

  closeGroup();
}

function print(record: Record, isInitialized: boolean, options: Options) {
  const { name, logger, colors, collapsed, diff, diffCollapsed } = options;
  const { time, nextState, prevState } = record;

  const action = isInitialized ? 'update' : 'init';
  const titleParts = [
    [`%c${action}`, 'color: gray; font-weight: lighter;'],
    name && [`%c${name}`, 'color: inherit; font-weight: bold;'],
    options.timestamp && [`%c@ ${formatTime(time)}`, 'color: gray; font-weight: lighter;'],
  ].filter(Boolean) as Array<[string, string]>;
  const title = titleParts.map(i => i[0]).join(' ');
  const titleCSS = titleParts.map(i => i[1]);
  const closeGroup = logGroup(logger, collapsed, title, ...titleCSS);

  if (isInitialized) {
    const prevStateCSS = `color: ${colors.prevState(prevState)}; font-weight: bold`;
    logger.log('%cprev state', prevStateCSS, prevState);

    const nextStateCSS = `color: ${colors.nextState(nextState)}; font-weight: bold`;
    logger.log('%cnext state', nextStateCSS, nextState);

    if (diff) {
      logDiff(prevState, nextState, logger, diffCollapsed);
    }
  } else {
    const nextStateCSS = `color: ${colors.nextState(nextState)}; font-weight: bold`;
    logger.log('%cstate', nextStateCSS, nextState);
  }

  closeGroup();
}

export function createLogger(root: unknown, options: Partial<Options> = {}) {
  const usedOptions = { ...DEFAULT_OPTIONS, ...options } as Options;
  const lens = createLens(root, _ => cloneDeep(_));

  let prevState: unknown = null;
  let isInitialized = false;

  return watch(lens, state => {
    const record: Record = {
      time: new Date(),
      nextState: null,
      prevState,
    };

    prevState = state;
    record.nextState = state;

    print(record, isInitialized, usedOptions);

    if (!isInitialized) {
      isInitialized = true;
    }
  });
}
