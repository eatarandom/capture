
var extend = function (a, b) {
    for (var i in b) {
        if (b.hasOwnProperty(i)) {
            a[i] = b[i];
        }
    }
    return a;
};

exports.helpers = {

	"extend object": function (test) {
		test.expect(4);

		var say = { 'hi': 'hi' }; 
		test.ok(true, 'should pass');
		test.equal(say.hi, 'hi', 'say hi should return hi');
		
		extend(say, { 'hi': 'hey', 'hello': 'hello' });
		test.equal(say.hi, 'hey', 'say hi should now return hey');
		test.equal(say.hello, 'hello', 'say hello should return hello');

		test.done();
	},

	"extend prototype": function (test) {
		test.expect(3);

		var Say = function () { 
			this.hi = 'hi'; 
		};

		test.ok(true, 'should pass');
		test.equal(new Say().hi, 'hi', 'say hi should return hi');
		
		extend(Say.prototype, { 
			'hello': 'hello' 
		});
		var say = new Say();

		test.equal(say.hello, 'hello', 'say hello should return hello');

		test.done();

	},

	"extend multiple objects": function (test) {
		test.expect(5);

		var say = { 'hi': 'hi' }; 
		
		test.ok(true, 'should pass');
		test.equal(say.hi, 'hi', 'say hi should return hi');
		
		extend(say, extend({ 
			'hi': 'hey', 
			'hello': 'hello' 
		}, { 
			'hi': 'hiya', 
			'howdy': 'howdy'
		}));

		test.equal(say.hi, 'hiya', 'say hi should now return hiya');
		test.equal(say.hello, 'hello', 'say hello should return hello');
		test.equal(say.howdy, 'howdy', 'say howdy should return howdy');

		test.done();
	}

};