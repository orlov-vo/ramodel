import { createModel, destroy, watch, get } from 'ramodel';
import { useState, useReducer, useRef, useEffect, useMemo, useCallback } from 'ramodel/hooks';

const BackendApi: any = null;

interface UserProps {
  firstName: string;
  lastName: string;
}

const User = createModel((init: UserProps) => {
  // Basic fields
  const [firstName, setFirstName] = useState(init.firstName);
  const [lastName, setLastName] = useState(init.lastName);

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

const Address = createModel((init: AddressProps) => {
  // Basic fields
  const [street, setStreet] = useState(init.street);

  // Export public fields and methods - they are read only
  return {
    country: init.country,
    zip: init.zip,
    city: init.city,
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
watch([get(john, _ => _.addresses.find(Boolean).name)], streetName => {
  console.log(`John lives on the ${streetName}`);
});

// Update once the first available address
const unsunscribe = watch(
  get(john, _ => _.addresses.find(Boolean)),
  johnAddress => {
    // Find first address and update it
    if (johnAddress) {
      johnAddress.setStreet('Oxford');
      unsunscribe();
    }
  },
);

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
