import { createInstance } from '../core/createInstance';
import { useState, useMemo, useCallback } from './mod';

describe('Hooks API', () => {
  test('should able to create computed fields', () => {
    const instance = createInstance({ firstName: 'John', lastName: 'Doe' }, input => {
      // Basic fields
      const [firstName, setFirstName] = useState(input.firstName || '');
      const [lastName, setLastName] = useState(input.lastName || '');

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
    });

    expect(instance).toHaveProperty('name', 'John Doe');

    instance.setName('John Baz');
    expect(instance).toHaveProperty('lastName', 'Baz');
    expect(instance).toHaveProperty('name', 'John Baz');
  });
});
