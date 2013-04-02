var capture = require("../src/capture");

exports.capture = {

	"init": function (test) {
		test.expect(1);
		test.equal('1', '1', 'test');
		test.done();
	}

};