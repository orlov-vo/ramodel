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

- [`ramodel`](docs/api-main.md)
  - Model
    - [`createModel`](docs/api-main.md#createmodel)
    - [`update`](docs/api-main.md#update)
    - [`destroy`](docs/api-main.md#destroy)
  - Lenses
    - [`makeLense`](docs/api-main.md#makelense)
    - [`combineLenses`](docs/api-main.md#combinelenses)
    - [`watch`](docs/api-main.md#watch)
  - Helpers
    - [`get`](docs/api-main.md#get)
- [`ramodel/hooks`](docs/api-hooks.md)
  - Basic Hooks
    - [`useState`](docs/api-hooks.md#usestate)
    - [`useEffect`](docs/api-hooks.md#useeffect)
  - Additional Hooks
    - [`useReducer`](docs/api-hooks.md#usereducer)
    - [`useMemo`](docs/api-hooks.md#usememo)
    - [`useCallback`](docs/api-hooks.md#usecallback)
    - [`useRef`](docs/api-hooks.md#useref)

## Thanks

This project based on [source code of "haunted"](https://github.com/matthewp/haunted).
Thanks [Matthew Phillips](https://github.com/matthewp) and other contributors for their big work.
