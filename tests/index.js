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

			more_test : This is a string: with a colon in it
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
	template_string : (t)=>{
		const name = 'scott';

		const result = trnp`
			test: -34_000.00
			yes:

			// This is a test

			foo:
			  bar : Oh hello
			        this is a multiline string
			  goop : ${false}

			users :
			  - name : ${name}
			    id   : foo
			  - name : mark
			    id   : boop

			more_test : This is a string: with a colon in it
		`;


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
	// comments : {
	// 	single_line
	// 	multiline
	// },
	// numbers
	// multiline_strings

}