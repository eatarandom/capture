/*
 *  capture.js
 *
 *  Description:
 *  Javascript tracking made easy.
 *  
 *  Current assumed dependencies:
 *  _ : Underscore (trying to remove?)
 *  $ : Zepto/Jquery (can we remove?)
 */

(function () {
    
    "use strict";

    var root = this;

    var VERSION = '0.0.1';

    // Default properties.
    var defaults = {
            debug: false,
            delay: false
        };
        
    // CaptureEvent default properties. 
    var captureEventDefaults = {
            id: -1,
            selector: 'body',
            action: 'click',
            type: 'track',
            props: {}
        };

    // Store CaptureEvents for internal use.
    // CaptureEvents are stored for multiple instances of Capture.
    var captureEvents = [];

    // Store Providers for internal use.
    var providers = [];

    // ## Helper Methods

    // #### Log
    // A safe way to console log.
    
    // Credit to __Paul Irish__.
    // Reference: [Log. A lightweight wrapper for console.log](http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/)
    var log = function () {
        if (this.debug) {
            log.history = log.history || [];   // store logs to an array for reference
            log.history.push(arguments);
            if (root.console) {
                console.log(Array.prototype.slice.call(arguments));
            }     
        }
    };
        
    // __Extend__ an object with some new properties.
    var extend = function (a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }
        return a;
    };


    // Create and return a __uniqueId__.
    
    // Credit the authors of __Underscore.js__ 
    // Reference `_.uniqueId()` from [Underscore.js](https://github.com/documentcloud/underscore)
    var idCounter = 0;
    var uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    // #### Keys
    // Return the keys on an object.
    
    // Credit the authors of __Underscore.js__ 
    // Reference `_.keys(obj)` [Underscore.js](https://github.com/documentcloud/underscore)
    var keys = Object.keys || function (obj) {
        if (obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
        return keys;
    };

    // #### Results
    // Searchs through the keys of an object.
    // If the value of the key is a function, the 
    // function is called with the provided context or root.
    // Otherwise, keep the key/value the same.
    var results = function (obj, context) {
        var ctx = context || root; // leak of scope here, fix
        _.each(keys(obj), function (key) {
            if (typeof obj[key] === 'function') {
                obj[key] = obj[key].call(context);
            }
        });
        return obj;
    };





    // ## Internal Methods

    // ### Events
    // Events shared throughout Capture.
    // TODO: Remove this stuff and apply mediator directly
    var Events = {
        evt: {
            track: 'TRACK',
            pageview: 'PAGEVIEW'
        },
        // 
        trigger: function () {
            var length = arguments.length++;
            arguments[length] = this;
            mediator.publish.apply(mediator, [].slice.call(arguments, 0).push(this));
        },
        on: function () {
            var length = arguments.length++;
            arguments[length] = this;
            mediator.subscribe.apply(mediator, arguments);
        }
    };
        

    var mediator = new Mediator();

    // ### Mediator
    // 
    function Mediator() {
        this.subjects = {};
    }

    extend(Mediator.prototype, {
        publish: function (name, options, context) {
            console.log('publish', this.subjects);
            if (this.subjects.hasOwnProperty(name)) {
                for (var i = 0, j = this.subjects[name].length; i < j; i++) {
                    var subject = this.subjects[name][i];
                    subject.callback.call(context, arguments);
                    console.log('calling', subject.callback, 'with', arguments);
                }   
            }
        },
        subscribe: function (name, callback, context) {
            name = name.toString();
            if (!this.subjects.hasOwnProperty(name)) {
                this.subjects[name] = [];    
            }
            this.subjects[name].push({
                context: this,
                callback: callback
            });
            console.log('subscribe', this.subjects);
        }
    });





    // ### CaptureEvent
    // Class for CaptureEvents.
    function CaptureEvent(options) {
        this.cid = uniqueId('ce');
        extend(this, extend(captureEventDefaults, options)); 
        if (this.id < 0) this.id = this.cid;
        this.initialize.call(this);
    }

    extend(CaptureEvent.prototype, extend(Events, {

        initialize: function () {
            this.triggerEvent();
        },

        triggerEvent: function () {
            this.trigger(this.type, results(this.props, this), this);
        }
    
    }));
    





    // ### Provider
    // Class for Providers.
    function Provider(options) {}
    
    extend(Provider.prototype, extend(Events, {
    
        initialize: function () {
            this.on('track', this.track);
            this.on('pageview', this.pageview);
        },

        track: function () {},

        pageview: function () {}

    })); 


    // ## Capture 

    // #### Contstuctor
    
    function Capture(config, options) {
        this.version = VERSION;

        if (!config || typeof config === 'object' && !config.length) {
            options = config;
        } else {
            this.config = config;     
        }
        extend(this, extend(defaults, options));
        this.initialize.call(this);
    }

    // ## Extend Capture
    extend(Capture.prototype, extend(Events, {

        // __Initialize__
        initialize: function () {
            this.on('track', this.track);
            this.on('pageview', this.pageview);
            
            if (this.config && this.config.length) {
                for (var i = 0, j = this.config.length; i < j; i++) {
                    this.addCaptureEvent(this.config[i]);
                }   
            }
        },
        // __Add a CaptureEvent__
        addCaptureEvent: function (capture_event) {
            var cEvents = captureEvents,
                length = cEvents.length,
                cEvent = new CaptureEvent(capture_event); 
            cEvents[length] = cEvent;
            log.call(this, 'Added a new CaptureEvent ', cEvent);
            return cEvent;
        },
        // __Remove a CaptureEvent__
        removeCaptureEvent: function (id) {},
        // __Track__
        track: function (options) {
            //this.trigger('track', options, this);
            console.log('hey i\'m tracking', options);
        },
        // __Pageview__
        pageview: function (options) {
            //this.trigger('pageview', options, this);
            console.log('hey i\'m pageview', options);
        }

    }));
   
    

    // ## Expose to the world

    // CommonJS
    var CommonJS = false;
    if (typeof module !== 'undefined' && module.exports) { 
        module.exports = Capture;
        CommonJS = true;
    }

    // AMD
    var AMD = false;
    if (typeof define === "function" && define.amd) {
        define("Capture", [], function () {
            return Capture;
        });
        AMD = true;
    }

    // Window
    if (!CommonJS && !AMD) {
        root.Capture = Capture;   
    }
    
}).call(this);