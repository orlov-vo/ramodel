import { createModel, update, destroy, watch, get, createLens } from 'ramodel';
import { useState, useReducer, useRef, useEffect, useMemo, useCallback } from 'ramodel/hooks';

const BackendApi: any = null;

interface UserProps {
  firstName: string;
  lastName: string;
}

const User = createModel((input: UserProps) => {
  // Basic fields
  const [firstName, setFirstName] = useState(input.firstName);
  const [lastName, setLastName] = useState(input.lastName);

  // Computed field
  const name = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);

  // Method for filling fields
  const setName = useCallback((newName: string) => {
    const [newFirstName, newLastName] = newName.split(' ');
    setFirstName(newFirstName);
    setLastName(newLastName);
  }, []);

  // Addresses as nesting state here
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    const unsubscribe = BackendApi.subscribe(`user/${firstName}-${lastName}/addresses`, newAddresses => {
      setAddresses(newAddresses.map(i => new Address(i)));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Export public fields and methods - they are read only
  return {
    name,
    firstName,
    lastName,
    setName,
    addresses,
  };
});

interface AddressProps {
  country: string;
  zip: string;
  city: string;
  street: string;
}

const Address = createModel((input: AddressProps) => {
  // Basic fields
  const [street, setStreet] = useState(input.street);

  // Export public fields and methods - they are read only
  return {
    country: input.country,
    zip: input.zip,
    city: input.city,
    street,
    setStreet,
  };
});

const john = new User({ firstName: 'John', lastName: 'Doe' });

console.log(john.name); // => 'John Doe'
john.setName('John Baz');
console.log(john.lastName); // => 'Baz'

// Find first address, get state name from it and print the name to console
// `get` function works same as `idx` https://github.com/facebookincubator/idx
watch([createLens(john, _ => _.addresses.find(Boolean).name)], streetName => {
  console.log(`John lives on the ${streetName}`);
});

// Update once the first available address
const unsunscribe = watch([createLens(john, _ => _.addresses.find(Boolean))], johnAddress => {
  // Find first address and update it
  if (johnAddress) {
    johnAddress.setStreet('Oxford');
    unsunscribe();
  }
});

// Update input and re-run main function in model
update(john, { firstName: 'Jesica', lastName: 'Brown' });
console.log(john.name); // => 'Jesica Brown'

setTimeout(() => {
  // Framework add this method to all models - its needed for clear side effects
  destroy(john);
}, 10000);

function useSubscription(selector) {
  const [value, setValue] = useState(get(selector));
  useEffect(() => {
    setValue(get(selector));
    return watch(selector, setValue);
  }, [selector]);

  return value;
}
