
var obj = {};
var log = function () {
    if (this.debug) {
        log.history = log.history || [];   // store logs to an array for reference
        log.history.push(arguments);
        if (window.console) {
            console.log(Array.prototype.slice.call(arguments));
        }     
    }
};

exports.helpers = {

	"log": function (test) {

		test.expect(1);
		test.ok(true, 'should pass');
		test.done();
	}

};
