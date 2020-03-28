import { createModel } from './core/createModel';
import { useState, useMemo, useCallback } from './hooks';

const createInstance = <Init extends object, Public extends object>(mainFn: (init: Init) => Public, init: Init) =>
  new (createModel(mainFn))(init);

describe('Hooks API', () => {
  test('should able to create computed fields', () => {
    const instance = createInstance(
      init => {
        // Basic fields
        const [firstName, setFirstName] = useState(init.firstName || '');
        const [lastName, setLastName] = useState(init.lastName || '');

        // Computed field
        const name = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
        const setName = useCallback((newName: string) => {
          const [newFirstName, newLastName] = newName.split(' ');
          setFirstName(newFirstName);
          setLastName(newLastName);
        }, []);

        // Export public fields and methods - they are read only
        return {
          name,
          firstName,
          lastName,
          setName,
        };
      },
      { firstName: 'John', lastName: 'Doe' },
    );

    expect(instance).toHaveProperty('name', 'John Doe');

    instance.setName('John Baz');
    expect(instance).toHaveProperty('lastName', 'Baz');
    expect(instance).toHaveProperty('name', 'John Baz');
  });
});
