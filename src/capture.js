// Capture.js 0.0.1
//  
//  (c) 2013 Dan Roberts, Ogilvy & Mather Atlanta
//  Capture may be freely distributed under the MIT license.
//  For all details and documentation:
//  https://github.com/eatarandom/capture
//  

(function () {
    
    "use strict";

    // Store a reference to `window` or `global` on the server.
    var root = this;

    // Current capture version.
    var VERSION = '0.0.1';

    // Default properties.
    var defaults = {
            debug: false,
            delay: false
        };
        
    // CaptureEvent default properties. 
    var captureEventDefaults = {
            selector: 'body',
            action: 'click',
            type: 'track',
            props: {}
        };

    // Store CaptureEvents for internal use.
    // Note: CaptureEvents are stored for multiple instances of Capture.
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

    // #### Has
    // Does an object have a key.
    
    // Credit the authors of __Underscore.js__ 
    // Reference `_.keys(obj)` [Underscore.js](https://github.com/documentcloud/underscore)
    var has = function (obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    };

    // #### Results
    // Searchs through the keys of an object.
    // If the value of the key is a function, the 
    // function is called with the provided context or root.
    // Otherwise, keep the key/value the same.
    var results = function (obj, context) {
        var ctx = context || root; // leak of scope here, fix
        
        for (var i = 0, j = keys(obj).length; i < j; i++) {
            if (typeof obj[key] === 'function') {
                obj[key] = obj[key].call(context);
            }   
        }
        return obj;
    };


    // ## Internal Methods

    // ### Events
    // Events Mediator shared throughout Capture.
    
    var Events = (function () {

        function Mediator() { 
            this.subjects = {}; 
        }

        extend(Mediator.prototype, {
            publish: function (name, options, context) {
                if (this.subjects.hasOwnProperty(name)) {
                    for (var i = 0, j = this.subjects[name].length; i < j; i++) {
                        var subject = this.subjects[name][i];
                        subject.callback.call(context, arguments);
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
            }
        });

        return {
            evt: {
                track: 'track',
                pageview: 'pageview'
            },
            mediator: new Mediator()
        };

    }).call(root);


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
            this.mediator.publish(this.type, results(this.props, this), this);
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

    extend(Capture.prototype, extend(Events, {

        // __Initialize__
        initialize: function () {
            this.mediator.subscribe('track', this.track);
            this.mediator.subscribe('pageview', this.pageview);
            
            if (this.config && this.config.length) {
                for (var i = 0, j = this.config.length; i < j; i++) {
                    this.addCaptureEvent(this.config[i]);
                }   
            }
        },
        
        addCaptureEvent: function (capture_event) {
            var cEvents = captureEvents,
                length = cEvents.length,
                cEvent = new CaptureEvent(capture_event); 
            cEvents[length] = cEvent;
            log.call(this, 'Added a new CaptureEvent ', cEvent);
            return cEvent;
        },
        
        removeCaptureEvent: function (cid) {
            for (var i = 0, l = captureEvents.length; i < l; i++) {
                var ce = captureEvents[i];
                if (ce.cid === cid) {
                    return ce;
                }
            }
            return false;
        },
        
        // should just be a wrapper to call providers 
        track: function (options) {
            //this.trigger('track', options, this);
            //console.log('hey i\'m tracking', options);
        },
        
        // should just be a wrapper to call providers 
        pageview: function (options) {
            //this.trigger('pageview', options, this);
            //console.log('hey i\'m pageview', options);
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