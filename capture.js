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
            log.history = log.history || []; // store logs to an array for reference
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

    // __Inherit__ from a super class.
    var inherits = function (props) {
        var parent = this,
            child = function () {
                return parent.apply(this, arguments);
            };

        extend(child, parent);

        var Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();

        if (props) extend(child.prototype, props);

        child.__super__ = parent.prototype;

        return child;
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
                //console.log('publish', name, props);
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
                // console.log('subscribe', name);
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
    // TODO distinguish events bewteen dom based or javascript based?

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
    // Class for Providers to extend.

    function Provider(options) {
        this.cid = uniqueId('provider');
        this.options = options;
        this.initialize.apply(this, arguments);
    }

    extend(Provider.prototype, extend(Events, {

        initialize: function () {
            this.mediator.subscribe(this.evt.track, this.track);
            this.mediator.subscribe(this.evt.pageview, this.pageview);
            this.setup.call(this);
        },
        setup: function () {},
        track: function () {},
        pageview: function () {}

    }));

    Provider.extend = inherits;


    // ### Providers

    var GAQProvider = Provider.extend({

        initialize: function (options) {
            // super
            Provider.prototype.initialize.apply(this, arguments);

            var _gaq = root._gaq;

            _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-11']);
            _gaq.push(['_trackPageview']);

            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);

        },

        track: function (props) {
            console.log('gaq track ', props);
        },

        pageview: function (props) {
            console.log('gaq pageview ', props);
        }

    });


    // ## Capture   

    function Capture(options) {
        this.version = VERSION;
        this.events = [];
        this.providers = [];
        extend(this, extend(defaults, options));
        this.initialize.apply(this, arguments);
    }

    extend(Capture.prototype, extend(Events, {

        initialize: function (options) {
            var opts = options,
                self = this,
                oEvents = opts.events,
                oProviders = opts.providers;

            if (opts) {
                if (oEvents && oEvents.length) {
                    for (var i = 0, j = oEvents.length; i < j; i++) {
                        self.events.push(self.addEvent(oEvents[i]));
                    }
                }

                if (oProviders && oProviders.length) {
                    for (var k = 0, l = oProviders.length; k < l; k++) {
                        self.providers.push(self.addProvider(oProviders[k]));
                    }
                }
            }
        },

        addProvider: function (provider) {
            var Surrogate = Provider.extend(provider.methods);
            return new Surrogate(provider.options);
        },

        removeProvider: function (cid) {},

        // TODO distinguish bewten dom based event and javascript based event?
        // TODO error check this so a new event isn't created unless it valid
        addEvent: function (capture_event) {
            return new CaptureEvent(capture_event);
        },

        // TODO: make sure to remove events when removing
        removeEvent: function (cid) {},

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