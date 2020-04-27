# RaModel

Awesome framework for creating reactive & flexible models with Hooks API.

[API References](#api-references) •
[Demo TodoMVC example](https://codesandbox.io/s/ramodel-demo-todo-otcd7)

- **Easy to learn.** It has the same [React Hooks API](https://reactjs.org/docs/hooks-reference.html)
- **Small.** The main goal of project is create framework with very small and clear API
- **Typed.** The library provide full coverege typings via TypeScript

**It is research project - it isn't ready for use in production yet.**

## Quick Start

### 1. Install the framework from NPM

Execute this command in your project to install the framework as new dependency:

```sh
npm install --save ramodel
```

Or if you using yarn:

```sh
yarn add ramodel
```

### 2. Start using for creating models.

Example:

```ts
import { createModel, destroy } from 'ramodel';
import { useState, useEffect } from 'ramodel/hooks';

interface CarProps {
  fuelQuantity: number;
  fuelConsumption: number;
}

const Car = createModel((props: CarProps) => {
  const [fuelQuantity, setFuelQuantity] = useState(props.fuelQuantity);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFuelQuantity(value => {
        if (value > 0) {
          return value - props.fuelConsumption;
        }

        console.log("Car's got empty tank!");

        return value;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [fuelQuantity]);

  return { fuelQuantity, setFuelQuantity };
});

const jeep = new Car({
  fuelQuantity: 40,
  fuelConsumption: 1,
});

setTimeout(() => {
  console.log(`Stop work... Jeep's got ${jeep.fuelQuantity} fuel`);
  destroy(jeep);
}, 3500);
```

## API References

- `ramodel`
  - Model
    - [`createModel`](#createmodel)
    - [`update`](#update)
    - [`destroy`](#destroy)
  - Lenses
    - [`makeLense`](#makelense)
    - [`combineLenses`](#combinelenses)
    - [`watch`](#watch)
  - Helpers
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
- `ramodel/remote`
  - Web Worker
    - [`connectWorker`](#connectworker)
    - [`expose`](#expose)

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

// Create an instance of Model with passwed props
const modelInstance = new Model(props);
```

If you want skip creating model and fast create needed instance you can use this shortcut:

```js
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

### `makeLense`

```js
import { makeLense } from 'ramodel';

const lense = makeLense(modelInstance, accessorFunction);
```

Create lense. Works like [`get()`](api-main.md#get) but returns lense instead value

### `combineLenses`

```js
import { combineLenses } from 'ramodel';

const lense = combineLenses(lenses, handler);
```

Combine lenses in the one. It is very handly when you need to calculate value which depends on multiple lenses.

### `watch`

```js
import { watch } from 'ramodel';

const unsubscribe = watch(lenses, handler);
```

Watch for changes in models use lenses. The `handler` recive values extracted with `accessorFunction`. Returns function for unsubscribe

```js
watch([lense], value => {
  console.log(value);
});
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

### `connectWorker`

```js
// Main thread
import { connectWorker } from 'ramodel/remote';

async function main() {
  const worker = new Worker('worker.js', { type: 'module' });
  const remoteWorld = connectWorker(worker);

  const myRemoteModel = await remoteWorld.get('my-model');

  // Now you can use `myRemoteModel` like local model
}
```

### `expose`

```js
// Worker thread
import { expose } from 'ramodel/remote/worker';

const world = expose();
world.set('my-model', myLocalModel);
```

## Thanks

This project based on [source code of "haunted"](https://github.com/matthewp/haunted).
Thanks [Matthew Phillips](https://github.com/matthewp) and other contributors for their big work.
Also big thanks to React's documentation authors for their very clear documentation about Hooks conceptions.
