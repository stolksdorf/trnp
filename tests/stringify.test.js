const trnp = require('../trnp.js');
const stringify = require('../stringify.js');


module.exports = {
	obj: (t)=>{
		const test = {
			foo : true,
			test : [
				{
					name : 'scoot',
					score : -34.03
				},
				{
					name : 'temp',
					tags : ['one', 'two']
				}
			],
			msg: "this is\na multiline\nstring",
			passcode: 45768
		};
		t.is(stringify(test), `foo: true
test: - name: scoot
        score: -34.03
      - name: temp
        tags: - one
              - two
msg: this is
     a multiline
     string
passcode: 45768`);
		t.is(trnp(stringify(test)), test);
	},
	arr: (t)=>{
		const test = [
			{
				name: 'scoot',
				score: -34.03
			},
			{
				name: 'temp',
				tags: ['one', 'two']
			}
		];

		t.is(stringify(test), `- name: scoot
  score: -34.03
- name: temp
  tags: - one
        - two`);
		t.is(trnp(stringify(test)), test);
	}
}

