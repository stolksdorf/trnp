const trnp = require('../simple.js');

module.exports = {
	basic: (t)=>{
		const result = trnp(`
			test: -34_000.05
			yes:

			// This is a test

			foo: false

			users : - scott
			  - mark

			more_test : This is a string: with a colon in it
			       also multiline
		`);

		t.is(result, {
			test: -34000.05,
			foo: false,
			users: [ 'scott', 'mark' ],
			more_test: 'This is a string: with a colon in it\nalso multiline'
		})
	}
}