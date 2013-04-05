// Capture 0.0.1
//  
// (c)  Dan Roberts, Ogilvy & Mather Atlanta
// Capture may be freely distributed under the MIT license.
// For all details and documentation:
// [http://eatarandom.github.com/capture/](http://eatarandom.github.com/capture/)
// 

(function () {
    
    "use strict";

    // Store a reference to `window` or `global` on the server.
    var root = this;

    // Reference to 
    var $ = root.Zepto || root.jQuery || root.$;

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










    // ## Internal Helper Methods

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
        var kys = keys(obj);
        for (var i = 0, j = kys.length; i < j; i++) {
            var key = kys[i];
            if (typeof obj[key] === 'function') {
                obj[key] = obj[key].call(context);
            }   
        }
        return obj;
    };

    // #### Each
    // TODO: make this happen
    var each = function () {};










    // ## Internal Methods

    // ### Events
    // Events Mediator shared throughout Capture.
    
    var Events = (function () {

        function Mediator() { 
            this.subjects = {}; 
        }

        extend(Mediator.prototype, {
            publish: function (name, props, context) {
                var subjects = this.subjects;
                if (subjects.hasOwnProperty(name)) {
                    for (var i = 0, j = subjects[name].length; i < j; i++) {
                        var subject = subjects[name][i];
                        subject.callback.call(context, props);
                    }   
                }
            },
            subscribe: function (name, callback) {
                var subjects = this.subjects;
                if (!subjects.hasOwnProperty(name)) {
                    subjects[name] = [];    
                }
                subjects[name].push({
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
    // Class for CaptureEvents. Assumed now to be events based on dom interaction. See todos.
    // TODO: distinguish events bewteen dom based or javascript based?
    function CaptureEvent(options) {
        this.cid = uniqueId('ce');
        extend(this, extend(captureEventDefaults, options)); 
        if (this.id < 0) this.id = this.cid;
        this.initialize.call(this);
    }

    extend(CaptureEvent.prototype, extend(Events, {

        initialize: function () {
            var self = this;

            this.selector = $(this.selector);
            if (!this.selector || !this.selector.length) {
                throw new Error('CaptureEvent' + this.id + 'needs a valid selector');
            }
            if (typeof this.type === 'string') {
                this.type = this.type.split();
            }
            this.selector.on(this.action, function (event) {
                self.publish(event);
            });
        },

        publish: function (event) {
            // remove in production
            event.preventDefault();    

            for (var i = 0, j = this.type.length; i < j; i++) {
                this.mediator.publish(this.type[i], results(this.props, event.target), this);    
            }

        }
    
    }));










    // ### Provider
    // Class for Providers to extend. This class should be instantiated.
    function Provider(options) {}
    
    extend(Provider.prototype, extend(Events, {
        
        initialize: function () {
            this.mediator.subscribe(this.evt.track, this.track);
            this.mediator.subscribe(this.evt.pageview, this.pageview);
        }

    })); 










    function GoogleAnalyticsProvider(options) {
        this.initialize.apply(this, arguments);
    }

    extend(GoogleAnalyticsProvider.prototype, extend(Provider.prototype, {

        track: function (props) {
            console.log('gaq track ', props);
        },

        pageview: function (props) {
            console.log('gaq pageview ', props);
        }

    }));










    // ## Capture   
    function Capture(options) {
        this.version = VERSION;
        this.events = [];
        // just to test provider
        // TODO: make this legit
        this.providers = [new GoogleAnalyticsProvider()];
        if (options.config && options.config.length) {
            this.config = options.config;
        }
        extend(this, extend(defaults, options));
        this.initialize.call(this);
    }

    extend(Capture.prototype, extend(Events, {

        initialize: function () {
            if (this.config && this.config.length) {
                for (var i = 0, j = this.config.length; i < j; i++) {
                    this.addEvent(this.config[i]);
                }   
            }
        },
        
        // TODO: distinguish bewten dom based event and javascript based event?
        // TODO: error check this so a new event isn't created unless it valid
        addEvent: function (capture_event) {
            var events = this.events,
                length = events.length,
                cEvent = new CaptureEvent(capture_event); 
            events[length] = events;
            //log.call(this, 'Added a new CaptureEvent ', cEvent);
            return cEvent;
        },
        
        // TODO: make sure to remove events when removing
        removeEvent: function (cid) {
            return false;
        },
        
        track: function (props) {
            this.mediator.publish('track', props, this);
        },
        
        pageview: function (props) {
            this.mediator.publish('pageview', props, this);
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