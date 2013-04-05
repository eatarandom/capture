var keys = Object.keys || function (obj) {
    if (obj !== Object(obj)) {
        throw new TypeError('Invalid object');
    }
    var keys = [];
    for (var key in obj) {
        if (has(obj, key)) {
            keys[keys.length] = key;
        }
    }
    return keys;
};

exports.helpers = {

	"keys": function (test) {
		test.expect(3);
		test.ok(true, 'should pass');
		
		var obj = {
			one: 'one',
			two: 'two'
		};

		test.equal(keys(obj).length, 2, 'keys array length should equal 2');
		test.equal(keys(obj)[0], 'one', 'first key of returning arrary should equal "one"');

		test.done();
	}

};