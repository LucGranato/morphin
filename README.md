# morphin

## Installation

```bash
npm install morphin --save
```

## Example

```js
const morphin = require('morphin');

const ranger = {
    id: 'abc001',
    name: 'Tommy',
    age: 24,
    emails: [
        'tommy@power.rangers',
        'tommy@gmail.com'
    ]
}

const result = morphin.go({
    source: ranger,
    mapper: {
        // Gets the value at `id` of source.
        // Sets the value at `id` of target.
        'id': true,

        // Gets the value at `name` of source.
        // Sets the value at `Ranger.Name` of target.
        'Ranger.Name': 'name',

        // Gets the value at `emails[0]` of source.
        // If the resolved value is undefined, the default value 'contact@power.rangers' is returned in its place.
        // Sets the value at `Ranger.Email` of target.
        'Ranger.Email': ['emails[0]', 'contact@power.rangers'],

        // Gets the value at `age` of source.
        // Passes as the first argument to the modifier function.
        // Sets the returned value at `Ranger.ShouldRetire` of target.
        'Ranger.ShouldRetire': ['age', age => age > MAX_AGE]
    }
});

console.log(result);
/**
 * {
 *   id: 'abc001',
 *   Ranger: {
 *     Name: 'Tommy',
 *     Email: 'tommy@power.rangers',
 *     ShouldRetire: false
 *   }
 * }
 **/
```

## To Do

- [ ] Documentation improvement
- [ ] Bind modifiers functions with source and target objects
