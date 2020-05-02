import { VoidFunction, GenericFunction } from './types';
import { State } from './state';
import { createEventEmitter } from './eventEmitter';

type TaskBox = { task: VoidFunction | null };

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
const write = runner();

/**
 * Scheduler for running Hooks
 */
export class Scheduler<R extends GenericFunction, C extends GenericFunction, H> {
  runFn: R;

  commitFn: C;

  host: H;

  state: State<H>;

  _isDestoyed: boolean = false;

  _isInFlushMode: boolean = false;

  _readTasks: TaskBox[] = [];

  _writeTasks: TaskBox[] = [];

  _isInUpdateQueued: boolean = false;

  constructor(runFn: R, commitFn: C, host: H) {
    this.runFn = runFn;
    this.commitFn = commitFn;
    this.host = host;
    this.state = new State(this.update.bind(this), host);

    read.onFlush(() => {
      this._readTasks = [];
    });
    write.onFlush(() => {
      this._writeTasks = [];
    });
  }

  read(fn: VoidFunction) {
    const task = read(fn);
    this._readTasks.push(task);
  }

  write(fn: VoidFunction) {
    const task = write(fn);
    this._writeTasks.push(task);
  }

  flush() {
    if (this._isDestoyed) return;

    this._isInFlushMode = true;

    const readTasks = this._readTasks;
    this._readTasks = [];
    flushTasks(readTasks);

    const writeTasks = this._writeTasks;
    this._writeTasks = [];
    flushTasks(writeTasks);

    this._isInFlushMode = false;
  }

  /**
   * Async version for update instance
   */
  update(): void {
    if (this._isDestoyed) return;
    if (this._isInUpdateQueued) return;

    this.read(() => {
      // Update phase
      const result = this.state.run(this.runFn);

      this.write(() => {
        // Commit phase
        this.commitFn(result);

        this.write(() => {
          // Effects phase
          this.state.runEffects();
        });
      });

      this._isInUpdateQueued = false;
    });
    this._isInUpdateQueued = true;
  }

  teardown(): void {
    this.state.teardown();
    this._isDestoyed = true;
  }
}
