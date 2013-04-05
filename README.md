# Capture [![Build Status](https://travis-ci.org/eatarandom/capture.png?branch=master)](https://travis-ci.org/eatarandom/capture)

> Javascript analytics made easy. (Currently in development.)

## Getting Started

```js
	var capture = new Capture({
		// default: false, Set to true to enabling logging
		debug: false,			
		// default: false, Set to true to delay event firing
		delay: false,			
		// default: empty array, Add 
		events: [],				
		// default: object, 
		provider: {}			
	});
```

## Tracking events through the DOM

```js
	var capture = Capture({
		events: [{
			// helpful for debugging purposes when something fails
			id: 0,
			// helpful when dynamically adding items to the dom
			// defaults to 'body'
			parent_selector: '',
			// selector to attach action to
			selector: ''
			// type of user interaction
			action: 'click',
			// type of event 
			type: 'track',
			// properties to send with the event
			props: {
				// required
				category: 'insert_category',
				// properties can be functions
				// functions are called on user interaction with 
				// the context of the interacted element						
		    	action: function() {
					return $(this).attr('href');
		    	},
			    // optional
			    opt_label: 'insert_opt_label',
			    opt_value: 'insert_opt_value',
			    opt_noninteraction: 'insert_opt_noninteraction'
			}
		}]
	})
```

## Tracking events through Javascript

```js

	// create an instance of Capture
	var capture = new Capture();
	
	// track an event
	capture.track({
		// required
		category: 'insert_category',						
    	action: 'insert_action',
	    // optional
	    opt_label: 'insert_opt_label',
	    opt_value: 'insert_opt_value',
	    opt_noninteraction: 'insert_opt_noninteraction'
	});
	
	// track a pageview
	capture.pageview({
		// optional
		url: 'insert_url'
	});

```


## Contributing to the project
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](https://npmjs.org/) installed. If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide.

### Getting setup locally

```bash
  	git clone https://github.com/eatarandom/capture.git
  	cd capture
  	npm install and bower install
```

Running unit tests

```bash
	grunt test
```

