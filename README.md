# Capture [![Build Status](https://travis-ci.org/eatarandom/capture.png?branch=master)](https://travis-ci.org/eatarandom/capture)


> Analytics made easy. (Currently in development.)

## Usage

```javascript
var config = [{
	'id': '100',								// helpful for error debugging
	'delay': false,								// should the call be delayed?
	'selector': '.test-link.a',					// zepto selector
	'action': 'click',							// dom action ('click', 'mouseover')
	'type': 'track',							// type can be string or function
	'props': {									// props can be strings or functions
    	category: 'category',
    	action: function() {
	    	return $(this).attr('href');
	    },
	    opt_label: 'opt_label',
	    opt_value: 'opt_value',
	    opt_noninteraction: 'opt_noninteraction'
	}
}];
var capture = Capture({							
	debug: true,								// default: false
	config: config								// (*required) an array of track objects
});
```
