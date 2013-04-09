# Capture [![Build Status](https://travis-ci.org/eatarandom/capture.png?branch=master)](https://travis-ci.org/eatarandom/capture)

> Javascript analytics made easy.

## Overview

Capture aims to provide a single location to configure all DOM event tracking. Capture can also be easily used for both __DOM__ and __javascript__ based analytics.

__What analytics providers does Capture support?__
> Capture currently has built in support for Google Analytics. However, Capture also supports adding your own provider. In future releases, there will be more built in providers.

__What is required to use Capture?__
> There's no need to go and look at the [Google Analytics](https://developers.google.com/analytics/devguides/collection/gajs/) documentation. The dependacies are currently handled internally by Capture. The only thing required to use Capture is a Google Analytics account number.

### Basic setup for handling DOM analytics

```js
	// Create an array of tracking objects to be passed into Capture.
	var eventsConfig = [{
		id: 1,
		parent_selector: 'header',
		selector: '.logo',
		action: 'click',
		type: 'track',
		props: {
			category: 'header',
			action: function(){
				return 'click_logo_' + document.location.pathname;
			},
			opt_label: 'non_non',
			opt_value: 1,
			opt_noninteraction: false
		}
		
	}];
	
	// Create an instance of Capture with an events config using Google Analytics.
	var capture = new Capture({
		events: eventsConfig,
		providers: [{
			name: 'gaq',
			options: {
				account: 'UA-XXXXX-X' 
			}
		}]
	});
```

### Basic setup for handling javascript analytics

```js
	// Create an instance of Capture using Google Analytics.
	var capture = new Capture({
		providers: [{
			name: 'gaq',
			options: {
				account: 'UA-XXXXX-X' 
			}
		}]
	});
	
	// Capture an event.
	capture.track({
		category: 'header',
		action: 'click_logo_',
		opt_label: 'non_non',
		opt_value: 1,
		opt_noninteraction: false	
	});
	
	// Capture a pageview.
	capture.pageview({
		url: document.location.pathname	
	});
```

## Options

### Providers _are an array of provider objects_.
```js
providers: [{
	name: '',
	options: {},
	methods: {}
}]
```

__Name__ _string_
> __Required__. Name of the provider you want to use or are creating.  

```js	
name: 'gaq'
```

__Options__ _object_
> __Required__. An object of options to pass into the the constructor of the Provider. 

```js	
options: { 
	account: 'UA-XXXXX-X'
}
```

__Methods__ _object_
> __Optional__. _Recommended for advanced use only_. Methods to extend the Provider prototype.

```js	
methods: {
	// Automatically called after initialize.
	setup: function () {}
}
```





### Events _are an array of event objects_.
```js
events: [{
	id: '',
	parent_selector: '',
	selector: '',
	action: '',
	type: '',
	props: {}
}]
```
__Id__ _number_
> __Optional__. Used in debugging to track which events failed/succeeded. _Support coming in 0.2.0-beta_.

```js	
 id: 1
```

__Parent selector__ _string/object_
> __Optional__. Helpful to speed up selection when dynamically adding elements to the dom. Defaults to 'body'.

```js	
parent_selector: 'section'
```

__Selector__ _string/object_
> __Required__. Selector that will be have action attached.

```js	
selector: 'a.track'
```

__Action__ _string_
> __Required__. Dom event to attach to selector.

```js	
action: 'click'
```

__Type__ _string/array_
> __Required__. Event type(s) that's triggered on user action.

```js	
type: 'track'
```

__Props__ _object_
> __Required__. Properties to send with the event type. Properties can be functions. If a function, it will be called with the context of the selector.

```js	
props: {
	// required
	category: '',
	action: '',
	// mandatory
	opt_label: '',
	opt_value: 0,
	opt_noninteraction: false,
	url: '',
}
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

