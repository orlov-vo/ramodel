# RaModel

<img src="https://orlov-vo.github.io/ramodel/logotype.svg" align="right"
     alt="RaModel logotype" width="200" height="200">

A library for creating reactive & flexible models with Hooks API.
Can works together with [**React**](#react-and-preact), [**Preact**](#react-and-preact) and [**Svelte**](#svelte).

[API References](#api-references) •
[Demo TodoMVC example](https://github.com/orlov-vo/ramodel-demo-todomvc)

- **Hooks.** It has Hooks like it made in [React](https://reactjs.org/docs/hooks-reference.html).
- **Fast**. It has many performance optimization to track changes only from needed instances.
- **Typed.** The library provide full coverage typings via TypeScript.
- **Contexts.** It has simple API to communicate between different contexts.
- **Small.** We try to minimize distributed size and use tiny dependencies.

[![Version](https://img.shields.io/npm/v/ramodel)](https://www.npmjs.com/package/ramodel)
[![Size on bundlephobia](https://img.shields.io/bundlephobia/minzip/ramodel)](https://bundlephobia.com/result?p=ramodel)
[![Openned issues](https://img.shields.io/github/issues-raw/orlov-vo/ramodel)](https://github.com/orlov-vo/ramodel/issues)
[![License MIT](https://img.shields.io/npm/l/ramodel)](https://github.com/orlov-vo/ramodel/blob/master/LICENSE.md)

## Quick Start

### 1. Install the library from NPM

Execute this command in your project to install the library as new dependency:

```sh
npm install --save ramodel
```

Or if you using yarn:

```sh
yarn add ramodel
```

### 2. Define your first model.

Import [`createModel`](#createmodel) method from the library

```js
import { createModel } from 'ramodel';
```

If you are using TypeScript you can write type for the model's input. This type will be used when you construct new instance of model or update the instance's input via [`update`](#update) method.

```ts
interface CarProps {
  fuelQuantity: number;
  fuelConsumption: number;
}
```

Now you can define your model with [`createModel`](#createmodel):

```ts
const Car = createModel((props: CarProps) => {
  // Main body which re-run on every update
  // Here you can use Hooks from `ramodel/hooks` module
  ...

  return {
    // Public methods and properties
    ...
  };
});
```

This is very similar to the React's functional components, but instead of returning elements, in RaModel you should return public methods and properties. Important: they are read-only, it helps you to use them without unpredictable state mutating from outside. You can mutate the model's state only with public methods

After defining you can construct new instance via `new` operator:

```js
const jeep = new Car({
  fuelQuantity: 40,
  fuelConsumption: 1,
});
```

The `jeep` variable will have all defined public methods and properties before in `Car` model.

Main the library's limitation is instances should be destroyed manually via [`destroy`](#destroy) method:

```js
destroy(jeep);
```

### 3. Subscribe to instance's updates

To watch needed updates you can use the system of lenses. It is power functional concept let us get the whole information about using models in result of calculation. This information can be used in [`watch`](#watch) method:

```js
import { createLens, watch } from 'ramodel';

const odometerLens = createLens(motocycle, _ => _.odometer);

watch(odometerLens, odometer => console.log(`Motocycle's odometer: ${odometer}`));
```

To debug state's changes you can use [`createLogger`](#createlogger) or [`connectReduxDevtools`](#connectreduxdevtools) method from devtools:

```js
import { createLogger } from 'ramodel/devtools';

createLogger(motocycle);
// or
connectReduxDevtools(motocycle);
```

### 4. Advance using models from remote context

All power of RaModel in providing simple API to use reactive models from remote contexts. The remote context here may be Web Worker or `window` from extension's background page or some remote server.

For example if you has some `worker.js` script which will be executed in Web Worker contexts you can export your instances to the main process.

```js
// worker.js - Worker's process
import { expose } from 'ramodel/remote/worker';

const world = expose();
world.set('jeep', jeep);
```

An then in main process you can import the `jeep` instance:

```js
// main.js - Main process
import { connect } from 'ramodel/remote/worker';

const worker = new Worker('worker.js', { type: 'module' });
const remoteWorld = connect(worker);

const jeep = await remoteWorld.get('jeep');

// Now you can use `jeep` like local model
// But it continue live in the worker process
```

## Integration with popular frameworks

RaModel has very simple API which easy to ingrate with many popular library and frameworks.
Most often you only need to use lenses and a [`watch`](#watch) method for subscribe updates.

### React and Preact

```js
import { useLens } from 'ramodel/react'; // or from 'ramodel/preact'
import { odometerLens } from './lenses';

function App() {
  const odometer = useLens(odometerLens);

  return <div>{odometer} miles</div>;
}
```

### Svelte

All lenses are fully compliant [Store contract](https://svelte.dev/docs#Store_contract) in read-only mode.
Because of this you can use lenses as [reactive variables](https://svelte.dev/docs#4_Prefix_stores_with_$_to_access_their_values).

```html
<script>
  import { odometerLens } from './lenses';
</script>

<div>{$odometerLens} miles</div>
```

### Angular, Vue and other frameworks

Sorry but I don't know these frameworks deeply to write good integration with them, if you want help me just [create a new issue](https://github.com/orlov-vo/ramodel/issues/new).

## API References

- `ramodel`
  - Model
    - [`createModel`](#createmodel)
    - [`update`](#update)
    - [`destroy`](#destroy)
  - Lenses
    - [`createLens`](#createlens)
    - [`combineLenses`](#combinelenses)
    - [`watch`](#watch)
  - Helpers
    - [`createContext`](#createcontext)
    - [`get`](#get)
- `ramodel/hooks`
  - Basic Hooks
    - [`useState`](#usestate)
    - [`useEffect`](#useeffect)
  - Additional Hooks
    - [`useReducer`](#usereducer)
    - [`useMemo`](#usememo)
    - [`useCallback`](#usecallback)
    - [`useRef`](#useref)
  - RaModel Hooks
    - [`useLens`](#uselens)
    - [`useModel`](#usemodel)
    - [`useModelFabric`](#usemodelfabric)
- `ramodel/remote/worker`
  - [`connect`](#worker-connect)
  - [`expose`](#worker-expose)
- `ramodel/remote/global`
  - [`connect`](#global-connect)
  - [`expose`](#global-expose)
- `ramodel/devtools`
  - [`createLogger`](#createlogger)
  - [`connectReduxDevtools`](#connectreduxdevtools)

### `createModel`

```js
import { createModel } from 'ramodel';

const Model = createModel(mainFn);
```

Create a new model which will use a passed function. This function can use [Hooks](api-hooks.md) and returns public methods and properties. Returns class for creating a model instance

```js
const Model = createModel((props) => {
  // Main body which re-run on every update
  // Here you can use Hooks
  ...

  return {
    // Public methods and properties
    ...
  };
});

// Create an instance of Model with passed props
const modelInstance = new Model(props);
```

If you want use reference to class as type you can use another way of defining models via `class extends`:

```ts
class Model extends createModel(() => {
  /* ... */
}) {}
```

If you want skip creating model and fast create needed instance you can use this shortcut:

```js
import { createInstance } from 'ramodel';

const modelInstance = createInstance(input, mainFn);
```

### `update`

```js
import { update } from 'ramodel';

update(modelInstance, newInput);
```

Update input in the model and re-run main function

```js
const User = createModel(({ firstName, lastName }) => {
  return { name: `${firstName} ${lastName}` };
});

const john = new User({ firstName: 'John', lastName: 'Doe' });
console.log(john.name); // => 'John Doe'

// Update input and re-run main function in model
update(john, { firstName: 'Jesica', lastName: 'Brown' });
console.log(john.name); // => 'Jesica Brown'
```

### `destroy`

```js
import { destroy } from 'ramodel';

destroy(...modelInstances);
```

Shutdown all side effects and clean the state in models instances

### `createLens`

```js
import { createLens } from 'ramodel';

const lens = createLens(modelInstance, accessorFunction);
```

Create lens. Works like [`get()`](api-main.md#get) but returns lens instead value

### `combineLenses`

```js
import { combineLenses } from 'ramodel';

const lens = combineLenses(lenses, handler);
```

Combine lenses in the one. It is very handly when you need to calculate value which depends on multiple lenses.

### `watch`

```js
import { watch } from 'ramodel';

const unsubscribe = watch(lenses, handler);
```

Watch for changes in models use lenses. The `handler` recive values extracted with `accessorFunction`. Returns function for unsubscribe

```js
watch([lens], value => {
  console.log(value);
});
```

### `createContext`

```js
import { createContext } from 'ramodel';

const Context = createContext(defaultValue);
```

Creates a Context object.

The `defaultValue` argument is only used when a model does not have a matching Context's value above it in the tree. This can be helpful for testing models in isolation without wrapping them. Note: passing `undefined` as a Context's value does not cause consuming models to use `defaultValue`.

For provide value you can use `Context.withValue`:

```js
Context.withValue(newValue, () => {
  // here you can create new model's instances
  // they will get the `newValue` when we `useContext` hook
});
```

You can dynamicly update the Context's value in instance and its children tree with `Context.updateValue`:

```js
Context.updateValue(instance, newValue);
```

Also you can delete the Context from instance with `Context.removeFrom`:

```js
Context.removeFrom(instance);
```

### `get`

```js
import { get } from 'ramodel';

const value = get(object, accessorFunction);
```

Traverses properties on objects and arrays. If an intermediate property is either null or undefined, it is instead returned. The purpose of this method is to simplify extracting properties from a chain of maybe-typed properties.

Returns the property accessed if accessor function could reach to property, null or undefined otherwise

Consider the following type:

```js
const props: {
  user?: {
    name: string,
    friends?: Array<User>,
  }
};
```

Getting to the friends of my first friend would resemble:

```js
props.user && props.user.friends && props.user.friends[0] && props.user.friends[0].friends;
```

Instead, `get` allows us to safely write:

```js
get(props, _ => _.user.friends[0].friends);
```

The second argument must be a function that returns one or more nested member expressions. Any other expression has undefined behavior.

### `useState`

```js
import { useState } from 'ramodel/hooks';

const [state, setState] = useState(initialState);
```

Returns a stateful value, and a function to update it.

During the initialization, the returned state (`state`) is the same as the value passed as the first argument (`initialState`).

The `setState` function is used to update the state. It accepts a new state value and enqueues a re-run main function of the model.

```js
setState(newState);
```

During subsequent re-updates, the first value returned by `useState` will always be the most recent state after applying updates.

Here’s the simple counter example:

```js
const Counter = createModel(() => {
  const [count, setCount] = useState(0);
  return { count, setCount };
});

const counter = new Counter();

console.log(counter.count); // => 0
counter.setState(5);
console.log(counter.count); // => 5
counter.setState(count => count - 2);
console.log(counter.count); // => 3
```

`setState` returns a promise which resolves when instance is updated before effects runs. It can be useful if you need wait model updating.
In main cases if you work with same instance it can be not needed because on every direct reading we try to finish all planned tasks for the instance before reading if it possible.

### `useEffect`

```js
import { useEffect } from 'ramodel/hooks';

useEffect(didUpdate);
```

Accepts a function that contains imperative, possibly effectful code.

Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a model. Doing so will lead to confusing bugs and inconsistencies in the state

Instead, use `useEffect`. The function passed to `useEffect` will run after a changes is committed to the model. Think of effects as an escape hatch from purely functional world into the imperative world.

By default, effects run after every completed change, but you can choose to fire them only when certain values have changed.

#### Cleaning up an effect

Often, effects create resources that need to be cleaned up before the model will be destroyed, such as a subscription or timer ID. To do this, the function passed to `useEffect` may return a clean-up function. For example, to create a subscription:

```js
useEffect(() => {
  const subscription = props.source.subscribe();

  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

The clean-up function runs when the model passed into [`destroy`](api-main.md#destroy) function to prevent memory leaks. Additionally, if a model changes multiple times (as they typically do), the previous effect is cleaned up before executing the next effect. In our example, this means a new subscription is created on every update. To avoid firing an effect on every update, refer to the next section.

#### Conditionally firing an effect

The default behavior for effects is to fire the effect after every completed change. That way an effect is always recreated if one of its dependencies changes.

However, this may be overkill in some cases, like the subscription example from the previous section. We don’t need to create a new subscription on every update, only if the source prop has changed.

To implement this, pass a second argument to `useEffect` that is the array of values that the effect depends on. Our updated example now looks like this:

```js
useEffect(() => {
  const subscription = props.source.subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [props.source]);
```

Now the subscription will only be recreated when props.source changes.

The array of dependencies is not passed as arguments to the effect function. Conceptually, though, that’s what they represent: every value referenced inside the effect function should also appear in the dependencies array.

### `useReducer`

```js
import { useReducer } from 'ramodel/hooks';

const [state, dispatch] = useReducer(reducer, initialArg, init);
```

An alternative to [`useState`](#usestate). Accepts a reducer of type `(state, action) => newState`, and returns the current state paired with a `dispatch` method. (If you’re familiar with Redux, you already know how this works.)

`useReducer` is usually preferable to [`useState`](#usestate) when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. `useReducer` also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks.

Here’s the counter example from the [`useState` section](#usestate), rewritten to use a reducer:

```js
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const Counter = createModel(() => {
  const [{ count }, dispatch] = useReducer(reducer, initialState);

  return {
    count,
    decrement: () => dispatch({ type: 'decrement' }),
    increment: () => dispatch({ type: 'increment' }),
  };
});

const counter = new Counter();

console.log(counter.count); // => 0
counter.increment();
console.log(counter.count); // => 1
counter.decrement();
console.log(counter.count); // => 0
```

`dispatch` returns a promise which resolves when instance is updated before effects runs. It can be useful if you need wait model updating.
In main cases if you work with same instance it can be not needed because on every direct reading we try to finish all planned tasks for the instance before reading if it possible.

#### Specifying the initial state

There are two different ways to initialize `useReducer` state. You may choose either one depending on the use case. The simplest way is to pass the initial state as a second argument:

```js
const [state, dispatch] = useReducer(reducer, { count: initialCount });
```

#### Lazy initialization

You can also create the initial state lazily. To do this, you can pass an `init` function as the third argument. The initial state will be set to `init(initialArg)`:

```js
function init(count) {
  return { count };
}

const [state, dispatch] = useReducer(reducer, initialCount, init);
```

### `useMemo`

```js
import { useMemo } from 'ramodel/hooks';

const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Returns a memoized value.

Pass a “create” function and an array of dependencies. `useMemo` will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every update.

If no array is provided, a new value will be computed on every update.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee**. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

### `useCallback`

```js
import { useCallback } from 'ramodel/hooks';

const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

Returns a memoized callback.

Pass an inline callback and an array of dependencies. `useCallback` will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child models that rely on reference equality to prevent unnecessary updates.

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

### `useRef`

```js
import { useRef } from 'ramodel/hooks';

const refContainer = useRef(initialValue);
```

`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

Essentially, `useRef` is like a “box” that can hold a mutable value in its `.current` property.

It’s handy for keeping any mutable value around similar to how you’d use instance fields in classes:

```js
const FormObserver = createModel(({ subscribe }) => {
  // We use `useRef` here instead `useState` because nobody depends on that state
  // and we don't want to re-run main function on receive new form
  const form = useRef(null);

  useEffect(
    () =>
      subscribe(newForm => {
        form.current = newForm;
      }),
    [subscribe],
  );

  return {
    focus: () => {
      if (form.current) {
        form.current.focus();
      }
    },
  };
});
```

This works because `useRef()` creates a plain JavaScript object. The only difference between `useRef()` and creating a `{current: ...}` object yourself is that useRef will give you the same ref object on every update.

Keep in mind that `useRef` doesn’t notify you when its content changes. Mutating the `.current` property doesn’t cause a re-update like `useState`.

### `useLens`

```js
import { useLens } from 'ramodel/hooks';

const value = useLens(lens);
```

With `useLens` hook you can get current value from the lens (which can created with [`createLens`](#createlens) or [`combineLenses`](#combinelenses)) and all subsequent values ​​in updates.

### `useModel`

```js
import { useModel } from 'ramodel/hooks';

const child = useModel(Model, {
  input: {},
  contexts: [
    [ContextA, contextValueA],
    [ContextB, contextValueB],
  ],
});
```

### `useModelFabric`

```js
import { useModelFabric } from 'ramodel/hooks';

const createInstance = useModelFabric(Model, {
  input: { foo: 'default' },
  contexts: [],
});

const [instance, updateInstance] = createInstance({ foo: 'bar' });

...

updateInstance({ foo: 'baz' })
```

### Worker `connect`

```js
import { connect } from 'ramodel/remote/worker';

const worker = new Worker('worker.js', { type: 'module' });
const remoteWorld = connect(worker);

const myRemoteModel = await remoteWorld.get('my-model');

// Now you can use `myRemoteModel` like local model
// But it continue live in the worker process
```

### Worker `expose`

```js
// Worker's process
import { expose } from 'ramodel/remote/worker';

const world = expose();
world.set('my-model', myLocalModel);
```

### Global `connect`

```js
import { connect } from 'ramodel/remote/global';

const backgroundWindow = chrome.extension.getBackgroundPage();
const remoteWorld = connect(backgroundWindow);

const myRemoteModel = await remoteWorld.get('my-model');

// Now you can use `myRemoteModel` like local model
// But it continue live in the background page's process
```

### Global `expose`

```js
import { expose } from 'ramodel/remote/global';

const backgroundWindow = chrome.extension.getBackgroundPage();
const world = expose(backgroundWindow);
world.set('my-model', myLocalModel);
```

### `createLogger`

```js
import { createLogger } from 'ramodel/devtools';

createLogger(instance, {
  name: 'my awesome instance',
  diff: true,
});
```

### `connectReduxDevtools`

```js
import { connectReduxDevtools } from 'ramodel/devtools';

connectReduxDevtools(instance, { name: 'my awesome instance' });
```

You can connect [Redux DevTools](https://github.com/reduxjs/redux-devtools) to debug your model instance.
It has a very basic integration with it, some features may not worked.

## Thanks

This project based on [source code of "haunted"](https://github.com/matthewp/haunted).

- Thanks [Gleb Arestov](https://github.com/arestov) and him project [Deklarota](https://github.com/arestov/deklarota) for inspire me to create this library for reactive model management.
- Thanks [Matthew Phillips](https://github.com/matthewp) and other contributors for their big work under re-implementing Hooks API.
- Also big thanks to React's documentation authors for their very clear documentation about Hooks conceptions.
