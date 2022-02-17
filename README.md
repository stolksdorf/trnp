# 🍠 `trnp`

> A tiny data markup language for non-technical humans that's Hard To Mess Upᵗᵐ


**features:**
- Minimal new syntax.
- Reduce opening/closing syntax whenever possible (eg. quotes, braces, etc.)
- Minimal data types: Booleans, numbers, strings; Lists and Dictionaries
- Multiline and single-line comments
- Multiline strings without additional syntax
- No weird type coercion. Eg. 'yes' -> true
- Indentation matters. Nesting behavior is defined by indentation, regardless of tabs or spaces.
- Tolerant error handling. If the parser encounters errors will continue to parse
- Parser is only **55 lines of code**



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
```

### Types

- *Booleans*: must be either `true` or `false` exactly
- *Numbers*: Handles negatives, decimals, and underscores anywhere within the number (eg. `-45_000.3_4_5` is valid)
- *Strings*: Any raw text. `trnp` does not use any quotes for parsing. Multiline strings must be the same indentation across lines, seperating empty lines are fine.
- *Arrays*: Line must start with `-`. Contiguous array lines will be joined into one list
- *Objects*: Key-val separated by a `: `. Must have a space after if it's value is on the same line. Keys must only contain letters, numbers, and underscores. Subsequent lines indented deeper than the key are processed as the value.


### Why not use YAML/TOML/JSON ?
I have found that with many of my projects having stake-holders, project managers, designers, etc. be able to modify and update some configuration data has lead to reducing development bottlenecks and allowed these project members to have more control over minor changes without going through developers each time.

Unfortunately most data markup languages are quite strict, and non-technical humans have a hard time interacting and updating these types of files.

YAML is _close_ to what I want, but I have found that it's spec has too many weird edge cases, and the parsers for it are clunky and hard to use when dealing with server-side/client-side bundlers.


### How it works
`trnp` runs in three steps:

1. First remove anything that looks like a comment
1. Creates tokens. A token has an indentation quantity, and either a value or key. Each object key and array dash is broken into it's own token.
1. Steps through each token to create a final value. If it encounters a token with a key, it plucks out all tokens with a indentation quantity greater than that token and runs the parse step on just those tokens. That result becomes the value of that group.

To demostrate, these are the tokens from the above example:

```js
[
  { key: 'test', idt: 3 },
  { val: -34000, idt: 9 },
  { key: 'yes', idt: 3 },
  { key: 'foo', idt: 3 },
  { key: 'bar', idt: 5 },
  { val: 'Oh hello', idt: 11 },
  { val: 'this is a multiline string', idt: 11 },
  { key: 'goop', idt: 5 },
  { val: false, idt: 12 },
  { key: 'users', idt: 3 },
  { key: true, idt: 5 },
  { key: 'name', idt: 7 },
  { val: 'scott', idt: 14 },
  { key: 'id', idt: 7 },
  { val: 'foo', idt: 14 },
  { key: true, idt: 5 },
  { key: 'name', idt: 7 },
  { val: 'mark', idt: 14 },
  { key: 'id', idt: 7 },
  { val: 'boop', idt: 14 },
  { key: 'more_test', idt: 3 },
  { val: 'This is a string: with a colon in it', idt: 15 }
]
```


### Simple Version
Also included is a light-weight simple version of `trnp`, primarily used for parsing the frontmatter of markdown files. While the core `trnp` library is very robust and handles arbitrary nesting, this lightweight version assumes restrictions that should not affect most short-form data specifications I've come across.

- Top-level value is always an object
- No nested objects or arrays
- Indentation is irrelevant

The simple version is half the lines of code and runs in only one pass. The code is also much easier to follow along and can be easily copy-and-pasted into any project.