var Capture = require("../src/capture");

exports.capture = {

	"empty initialization": function (test) {
		test.expect(3);
		
		var capture = new Capture();

		test.ok(typeof capture.config === 'undefined', 'default config should be undefined if not passed');
		test.equal(capture.debug, false, 'default property debug should be false');
		test.equal(capture.delay, false, 'default property delay should be false');
		test.done();
	},

	"initialization": function (test) {
		test.expect(3);

		var capture = new Capture([{}], {
			debug: false,
			delay: true
		});

		test.ok(capture.config.length === 1, 'config length should be equal to 1');
		test.equal(capture.debug, false, 'property debug should equal false');
		test.equal(capture.delay, true, 'property debug should equal true');		
		test.done();
	}

};