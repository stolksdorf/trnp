# 🍠 `trnp`

> A tiny data markup language for non-technical humans that's Hard To Mess Upᵗᵐ


*features:*
- Minimal new syntax.
- Reduce opening/closing syntax whenever possible (eg. quotes, braces, etc.)
- Minimal data types: Booleans, numbers, strings; Lists and Dictionaries
- Multiline and single-line comments
- Multiline strings without additional syntax
- No weird type coercion. Eg. 'yes' -> true
- Indentation matters. Nesting behavior is defined by indentation.
- Tolerant error handling. If the parser encounters errors will continue to parse



### Example

```
test: -34_000.00
yes:

/* This is a test */

// alert: 'danger!'

foo:
  bar : Oh hello
        this is a multiline string
  goop : false

users :
  - name : scott
    id   : foo
  - name : mark
    id   : boop

more_test : This is a string: with a colon in it
```

this converts to:

```js
{
	test: -34000.00,
	yes: undefined,
	foo: {
		bar : "Oh hello\nthis is a multiline string",
		goop : false
	},
	users : [
		{ name : 'scott', id : 'foo' },
		{ name : 'mark', id  : 'boop' },
	],
	more_test : 'This is a string: with a colon in it'
}
```

### Usage

```
npm install pico-trnp
```

```js
const trnp = require('pico-trnp');

const groceries = trnp(`
- eggs
- bacon
-pancakes
`);

//You can even use it as a tagged template literal if you want to enable syntax highlighting within your editor

const result = trnp`
user: scott
cool_guy : true
`
```

### Types

- *Booleans*: must be either `true` or `false` exactly
- *Numbers*: Handles negatives, decimals, and underscores anywhere within the number (eg. `-45_000.3_4_5` is valid)
- *Strings*: Any raw text. `trnp` does not use any quotes for parsing. Multiline strings must be the same indentation across lines, seperating empty lines are fine.
- *Arrays*: Line must start with `-`. Contiguous array lines will be joined into one list
- *Objects*: Key-val separated by a `:`. Keys must only contain letters, numbers, and underscores. Subsequent lines indented deeper than the key are processed as the value.


### Why not use YAML/TOML/JSON ?
I have found that with many of my projects having stake-holders, project managers, designers, etc. be able to modify and update some configuration data has lead to reducing development bottlenecks and allowed these project members to have more control over minor changes without going through developers each time.

Unfortunately most data markup languages are quite strict, and non-technical humans have a hard time interacting and updating these types of files.

YAML is _close_ to what I want, but I have found that it's spec has too many weird edge cases, and the parsers for it are clunky and hard to use when dealing with server-side/client-side bundlers.

