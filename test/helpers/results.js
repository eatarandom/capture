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

var results = function (obj, context) {
    var ctx = context || root; // leak of scope here, fix
    var kys = keys(obj);
    for (var i = 0, j = kys.length; i < j; i++) {
        var key = kys[i];
        if (typeof obj[key] === 'function') {
            obj[key] = obj[key].call(context);
        }   
    }
    return obj;
};

exports.helpers = {

	"results": function (test) {

		test.expect(2);
		test.ok(true, 'should pass');

		var obj = {
			one: function () {
				return 'one';
			}
		};

		test.equal(results(obj).one, 'one', 'obj.one should equal "one"');

		test.done();
	}

};