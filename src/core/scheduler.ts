import { VoidFunction, GenericFunction } from './types';
import { State } from './state';

const defer = Promise.resolve().then.bind(Promise.resolve());

function runner() {
  let tasks: VoidFunction[] = [];
  let id: Promise<void> | null;

  function runTasks() {
    id = null;
    const t = tasks;
    tasks = [];
    t.forEach(i => i());
  }

  const result = (task: VoidFunction) => {
    tasks.push(task);
    if (id == null) {
      id = defer(runTasks);
    }
  };

  result.flush = () => runTasks();

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

  _flushMode: boolean = false;

  _updateQueued: boolean = false;

  constructor(runFn: R, commitFn: C, host: H) {
    this.runFn = runFn;
    this.commitFn = commitFn;
    this.host = host;
    this.state = new State(this.update.bind(this), host);
  }

  flush() {
    if (this._isDestoyed) return;

    this._flushMode = true;
    read.flush();
    write.flush();
    this._flushMode = false;
  }

  /**
   * Async version for update instance
   */
  update(): void {
    if (this._isDestoyed) return;
    if (this._updateQueued) return;

    read(() => {
      // Update phase
      const result = this.state.run(this.runFn);

      const commit = () => {
        // Commit phase
        this.commitFn(result);

        write(() => {
          // Effects phase
          this.state.runEffects();
        });
      };

      if (this._flushMode) {
        commit();
      } else {
        write(commit);
      }
      this._updateQueued = false;
    });
    this._updateQueued = true;
  }

  teardown(): void {
    this.state.teardown();
    this._isDestoyed = true;
  }
}
