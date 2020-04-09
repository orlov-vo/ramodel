[Return to home page](../README.md)

# Module: `ramodel`

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

## `createModel`

```js
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

## `update`

```js
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

## `destroy`

```js
destroy(...modelInstances);
```

Shutdown all side effects and clean the state in models instances

## `makeLense`

```js
const lense = makeLense(modelInstance, accessorFunction);
```

Create lense. Works like [`get()`](api-main.md#get) but returns lense instead value

## `combineLenses`

```js
const lense = combineLenses(lenses, handler);
```

Combine lenses in the one. It is very handly when you need to calculate value which depends on multiple lenses.

## `watch`

```js
const unsubscribe = watch(lenses, handler);
```

Watch for changes in models use lenses. The `handler` recive values extracted with `accessorFunction`. Returns function for unsubscribe

```js
watch([lense], value => {
  console.log(value);
});
```

## `get`

```js
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
