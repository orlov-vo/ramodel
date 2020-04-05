[ramodel](../README.md) › ["hooks"](_hooks_.md)

# Module: "hooks"

## Index

### Variables

* [useEffect](_hooks_.md#const-useeffect)
* [useMemo](_hooks_.md#const-usememo)
* [useReducer](_hooks_.md#const-usereducer)
* [useState](_hooks_.md#const-usestate)

### Functions

* [useCallback](_hooks_.md#const-usecallback)
* [useRef](_hooks_.md#const-useref)

## Variables

### `Const` useEffect

• **useEffect**: *function* = hook(
  class extends Hook {
    callback!: Effect;

    lastValues?: unknown[];

    values?: unknown[];

    _teardown!: VoidFunction | void;

    constructor(id: number, state: State, _effect: Effect, _values: unknown[]) {
      super(id, state);
      state[EFFECTS].push(this);
    }

    update(callback: Effect, values?: unknown[]): void {
      this.callback = callback;
      this.lastValues = this.values;
      this.values = values;
    }

    call(): void {
      if (!this.values || this.hasChanged()) {
        this.run();
      }
    }

    run(): void {
      this.teardown();
      this._teardown = this.callback.call(this.state);
    }

    teardown(): void {
      if (typeof this._teardown === 'function') {
        this._teardown();
      }
    }

    hasChanged(): boolean {
      return !this.lastValues || this.values!.some((value, i) => this.lastValues![i] !== value);
    }
  },
)

#### Type declaration:

▸ (...`args`: P): *R*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | P |

___

### `Const` useMemo

• **useMemo**: *Object* = hook(
  class Memo<T> extends Hook {
    value: T;

    values: unknown[];

    constructor(id: number, state: State, fn: () => T, values: unknown[]) {
      super(id, state);
      this.value = fn();
      this.values = values;
    }

    update(fn: () => T, values: unknown[]): T {
      if (this.hasChanged(values)) {
        this.values = values;
        this.value = fn();
      }
      return this.value;
    }

    hasChanged(values: unknown[] = []): boolean {
      return values.some((value, i) => this.values[i] !== value);
    }
  },
)

___

### `Const` useReducer

• **useReducer**: *Object* = hook(
  class<S, I, A> extends Hook {
    reducer!: Reducer<S, A>;

    currentState: S;

    constructor(id: number, state: State, _: Reducer<S, A>, initialState: I, init?: (_: I) => S) {
      super(id, state);
      this.dispatch = this.dispatch.bind(this);
      this.currentState = init !== undefined ? init(initialState) : <S>(<any>initialState);
    }

    update(reducer: Reducer<S, A>): readonly [S, (action: A) => void] {
      this.reducer = reducer;
      return [this.currentState, this.dispatch];
    }

    dispatch(action: A): void {
      this.currentState = this.reducer(this.currentState, action);
      this.state.update();
    }
  },
)

___

### `Const` useState

• **useState**: *Object* = hook(
  class<T> extends Hook {
    args!: readonly [T, StateUpdater<T>];

    constructor(id: number, state: State, initialValue: T) {
      super(id, state);
      this.updater = this.updater.bind(this);

      this.makeArgs(typeof initialValue === 'function' ? initialValue() : initialValue);
    }

    update(): readonly [T, StateUpdater<T>] {
      return this.args;
    }

    updater(value: NewState<T>): void {
      if (typeof value === 'function') {
        const updaterFn = value as (previousState?: T) => T;
        const [previousValue] = this.args;
        this.makeArgs(updaterFn(previousValue));
      } else {
        this.makeArgs(value);
      }

      this.state.update();
    }

    makeArgs(value: T): void {
      this.args = Object.freeze([value, this.updater] as const);
    }
  },
)

## Functions

### `Const` useCallback

▸ **useCallback**<**T**>(`fn`: T, `inputs`: unknown[]): *T*

**Type parameters:**

▪ **T**: *Function*

**Parameters:**

Name | Type |
------ | ------ |
`fn` | T |
`inputs` | unknown[] |

**Returns:** *T*

___

### `Const` useRef

▸ **useRef**<**T**>(`initialValue`: T): *object*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`initialValue` | T |

**Returns:** *object*

* **current**: *T* = initialValue
