// Copyright 2020 the RaModel authors. All rights reserved. MIT license.
// Copyright 2018-2019 Matthew Phillips. All rights reserved. BSD 2-Clause license.

import { VoidFunction, GenericFunction } from './types';
import { State } from './state';
import { createEventEmitter } from './eventEmitter';
import { HOOK } from './symbols';

type TaskBox = { task: VoidFunction | null };

type Tasks = {
  tasks: TaskBox[];
  run(task: VoidFunction): void;
  flush(): void;
};

const FLUSH_LOOPS_COUNT = 10;

const defer = Promise.resolve().then.bind(Promise.resolve());

function flushTasks(tasks: TaskBox[]) {
  tasks.forEach(box => {
    if (box.task != null) {
      box.task();
      // eslint-disable-next-line no-param-reassign
      box.task = null;
    }
  });
}

function runner() {
  let tasks: TaskBox[] = [];
  let id: Promise<void> | null;

  const emitter = createEventEmitter();

  function runTasks() {
    id = null;
    const t = tasks;
    tasks = [];
    flushTasks(t);
    emitter.emit('flush');
  }

  const result = (task: VoidFunction) => {
    const taskBox = { task };
    tasks.push(taskBox);
    if (id == null) {
      id = defer(runTasks);
    }

    return taskBox;
  };

  result.onFlush = emitter.on.bind(null, 'flush');

  return result;
}

const read = runner();
const commit = runner();
const write = runner();

/**
 * Scheduler for running Hooks
 */
export class Scheduler<R extends GenericFunction, C extends GenericFunction, H> {
  runFn: R;

  commitFn: C;

  host: H;

  state: State<H>;

  _isDestroyed: boolean = false;

  _isInFlushMode: boolean = false;

  _tasks: Record<string, Tasks> = {};

  _updatePromise: Promise<void> | null = null;

  constructor(runFn: R, commitFn: C, host: H) {
    this.runFn = runFn;
    this.commitFn = commitFn;
    this.host = host;
    this.state = new State(this.update.bind(this), host);

    Object.entries({ read, commit, write }).forEach(([name, run]) => {
      const t = {
        tasks: [] as TaskBox[],
        run: (fn: VoidFunction) => {
          const task = run(fn);
          t.tasks.push(task);
        },
        flush: () => {
          const { tasks } = t;
          t.tasks = [];
          flushTasks(tasks);
        },
      };

      this._tasks[name] = t;

      run.onFlush(() => {
        t.tasks = [];
      });
    });
  }

  flush(): void {
    if (this._isDestroyed) return;

    this._isInFlushMode = true;

    for (let i = 0; i <= FLUSH_LOOPS_COUNT; i += 1) {
      if (!this._tasks.write.tasks.length && !this._tasks.read.tasks.length && !this._tasks.commit.tasks.length) break;

      this._tasks.write.flush();
      this._tasks.read.flush();
      this._tasks.commit.flush();

      if (i === FLUSH_LOOPS_COUNT) {
        console.error('Detected long loop on flush state, will skip tasks and resume control flow without them');
      }
    }

    this._isInFlushMode = false;
  }

  /**
   * Async version for update instance
   */
  async update(): Promise<void> {
    if (this._isDestroyed) return;
    if (this._updatePromise) {
      await this._updatePromise;
      return;
    }

    this._updatePromise = new Promise((resolve, reject) => {
      this._tasks.read.run(() => {
        // Update phase
        const prevHooksCount = this.state[HOOK].size;
        const result = this.state.run(this.runFn);
        const nextHooksCount = this.state[HOOK].size;

        this._updatePromise = null;

        if (prevHooksCount && prevHooksCount !== nextHooksCount) {
          const errorMessage = [
            `It seems you change count of hooks in ${this.runFn.name}.`,
            'Often it can happen when you are using if/loop statements in model.',
          ].join(' ');

          reject(new Error(errorMessage));
          return;
        }

        this._tasks.commit.run(() => {
          // Commit phase
          this.commitFn(result);
          resolve();

          this._tasks.write.run(() => {
            // Effects phase
            this.state.runEffects();
          });
        });
      });
    });

    await this._updatePromise;
  }

  teardown(): void {
    this.state.teardown();
    this._isDestroyed = true;
  }
}
