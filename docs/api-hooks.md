[Return to home page](../README.md)

# Module: `ramodel/hooks`

In this document you can see adopted version of the [React Hooks API](https://reactjs.org/docs/hooks-reference.html).

Currently RaModel supports the following hooks:

- Basic Hooks
  - [`useState`](api-hooks.md#usestate)
  - [`useEffect`](api-hooks.md#useeffect)
- Additional Hooks
  - [`useReducer`](api-hooks.md#usereducer)
  - [`useMemo`](api-hooks.md#usememo)
  - [`useCallback`](api-hooks.md#usecallback)
  - [`useRef`](api-hooks.md#useref)

## `useState`

```js
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

## `useEffect`

```js
useEffect(didUpdate);
```

Accepts a function that contains imperative, possibly effectful code.

Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a model. Doing so will lead to confusing bugs and inconsistencies in the state

Instead, use `useEffect`. The function passed to `useEffect` will run after a changes is committed to the model. Think of effects as an escape hatch from purely functional world into the imperative world.

By default, effects run after every completed change, but you can choose to fire them only when certain values have changed.

### Cleaning up an effect

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

### Conditionally firing an effect

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

## `useReducer`

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

An alternative to [`useState`](api-hooks.md#usestate). Accepts a reducer of type `(state, action) => newState`, and returns the current state paired with a `dispatch` method. (If you’re familiar with Redux, you already know how this works.)

`useReducer` is usually preferable to `useState` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. `useReducer` also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks.

Here’s the counter example from the `useState` section, rewritten to use a reducer:

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

### Specifying the initial state

There are two different ways to initialize useReducer state. You may choose either one depending on the use case. The simplest way is to pass the initial state as a second argument:

```js
const [state, dispatch] = useReducer(reducer, { count: initialCount });
```

### Lazy initialization

You can also create the initial state lazily. To do this, you can pass an `init` function as the third argument. The initial state will be set to `init(initialArg)`:

```js
function init(count) {
  return { count };
}

const [state, dispatch] = useReducer(reducer, initialCount, init);
```

## `useMemo`

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

Returns a memoized value.

Pass a “create” function and an array of dependencies. `useMemo` will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every update.

If no array is provided, a new value will be computed on every update.

**You may rely on `useMemo` as a performance optimization, not as a semantic guarantee**. Write your code so that it still works without `useMemo` — and then add it to optimize performance.

## `useCallback`

```js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

Returns a memoized callback.

Pass an inline callback and an array of dependencies. `useCallback` will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child models that rely on reference equality to prevent unnecessary updates.

`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

## `useRef`

```js
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
