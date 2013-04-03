
var idCounter = 0;
var uniqueId = function (prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
};

exports.helpers = {
	
	"uniqueId": function (test) {
		test.expect(4);
		test.equal(uniqueId(), '1', 'should return 1');
		test.equal(uniqueId(), '2', 'should return 2');
		test.equal(uniqueId('test_'), 'test_3', 'should return test_3');
		test.equal(uniqueId('test_'), 'test_4', 'should return test_4');
		test.done();
	}
		
};