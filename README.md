# Capture [![Build Status](https://travis-ci.org/eatarandom/capture.png?branch=master)](https://travis-ci.org/eatarandom/capture)

> Google analytics made easy.

## Overview

Capture aims to provide a single location to configure all DOM event tracking. Capture can also be easily used for both __DOM__ and __javascript__ based analytics.

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
			opt_value: 1
		}
		
	}];
	
	// Create an instance of Capture with an events config using Google Analytics.
	var capture = new Capture({
		events: eventsConfig,
		provider_config: {
			account:'UA-XXX-XXXX',
			namespace: 'ga',
			props: {}
		},
		debug: false
	});
```

### Basic setup for handling javascript analytics
More info coming soon

## Options
More info coming soon

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

