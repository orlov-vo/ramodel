# RaModel

Awesome framework for creating reactive & flexible models with Hooks API.

- **Easy to learn.** It has the same [React Hooks API](https://reactjs.org/docs/hooks-reference.html)
- **Small.** The main goal of project is create framework with very small and clear API 
- **Typed.** The library provide full coverege typings via TypeScript

**It is research project - it isn't ready for use in production yet.**

[Demo TodoMVC example](https://codesandbox.io/s/ramodel-demo-todo-otcd7)

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

const Car = createModel((init: CarProps) => {
  const [fuelQuantity, setFuelQuantity] = useState(init.fuelQuantity);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setFuelQuantity(value => {
        if (value > 0) {
          return value - init.fuelConsumption;
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

## Thanks

This project based on [source code of "haunted"](https://github.com/matthewp/haunted).
Thanks [Matthew Phillips](https://github.com/matthewp) and other contributors for their big work.
