let parse;

//parse = require('./recursive.js');
//parse = require('./by_line.js');
parse = require('./pico-ml.js');


let res,code;



code = `
test: -34_000.00
yes:

// This is a test

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
`

console.log('here')

res = parse(code)

console.log(res);