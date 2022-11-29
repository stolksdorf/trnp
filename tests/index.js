const trnp = require('../trnp.js');

module.exports = {
	complete: (t)=>{
		const result = trnp(`
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

			more_test : "This is a string: with a colon in it"
		`);

		t.is(result, {
			test: -34000.00,
			yes: undefined,
			foo: {
				bar : "Oh hello\nthis is a multiline string",
				goop : false
			},

			users : [
				{ name : 'scott', id : 'foo' },
				{ name : 'mark', id   : 'boop' },
			],
			more_test : 'This is a string: with a colon in it'
		})
	},
	multinewlines : (t)=>{
		const result = trnp(`
			test: this is
			        a multiline

			       thing with empty
			     lines
			foo : true
		`);
		t.is(result, { test: 'this is\na multiline\nthing with empty\nlines', foo: true });
	},
	simple : require('./simple.test.js'),
	stringify : require('./stringify.test.js')

}