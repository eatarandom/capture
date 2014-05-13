// Capture 0.2.2
//  
// (c)  Dan Roberts
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
    var VERSION = '0.2.2';


    // ## Internal Helper Methods


    // #### Log
    // A safe way to console log.
    var log = function () {
        log.history = log.history || []; // store logs to an array for reference
        log.history.push(arguments);
        if (root.console) {
            console.log('Capture', Array.prototype.slice.call(arguments));
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
            keys[keys.length] = key;
        }
        return keys;
    };

    // #### Results
    // Searchs through the keys of an object.
    // If the value of the key is a function, the 
    // function is called with the provided context or root.
    // Otherwise, keep the key/value the same.
    var results = function (props, context) {
        var ctx = context || root; // leak of scope here, fix
        var kys = keys(props);
        var obj = {};
        for (var i = 0, j = kys.length; i < j; i++) {
            var key = kys[i];
            if (typeof props[key] === 'function') {
                obj[key] = props[key].call(context);
            } else {
                obj[key] = props[key];
            }
        }
        return obj;
    };

    // #### Each
    // Loop through an array.
    var each = function (obj, callback, context) {
        var i = 0,
            j = obj.length;
        for (i; i < j; i++) {
            callback.call(context, obj[i], i, obj);
        }
    };

    // #### Flatten
    var flatten = function (obj) {
        var values = [];
        for (var key in obj) {
            values.push(obj[key]);
        }
        return values;
    };


    /**
     *  CaptureEvent
     *
     *  capture             {Capture}
     *  id                  {Number}
     *  parent_selector     {String}{Object}
     *  selector            {String}{Object}
     *  action              {String}
     *  type                {String}
     *  delay               {Boolean}
     *  prevent             {Boolean}
     *  props               {Object}
     *  initialize()        {Function}
     *  message()           {Function}
     */
    function CaptureEvent(capture, options) {
        this.cid = uniqueId('event');
        this.capture = capture;
        this.defaults = {
            id: '',
            parent_selector: 'html',
            selector: '',
            action: '',
            type: '',
            delay: false,
            prevent: false,
            props: null
        };
        extend(this, extend(this.defaults, options));
        this.initialize.apply(this, options);
        if (capture.debug) {
            log('Created Event', this.toString(), this);
        }
    }

    extend(CaptureEvent.prototype, {
        initialize: function () {
            var self = this;
            if (!this.parent_selector || !this.parent_selector.length) {
                throw new Error('CaptureEvent #' + this.id + ' needs a valid parent_selector');
            }
            if (!this.selector || !this.selector.length) {
                throw new Error('CaptureEvent #' + this.id + ' needs a valid selector');
            }
            $(this.parent_selector).on(self.action, self.selector, function (event) {
                if (self.prevent) {
                    event.preventDefault();
                }
                self.message({
                    type: self.type,
                    props: self.props,
                    context: event.target
                });
            });
        },
        // Send a message to Capture facade.
        message: function (msg) {
            this.capture.message(msg);
        },
        toString: function () {
            return 'CaptureEvent' + ' ' + this.id;
        }
    });
    /**
     *  Capture Facade
     *
     *  version             {String}
     *  providers           {Array}
     *  config              {Array}
     *  events              {Array}
     *  initialize()        {Function}
     *  log()               {Function}
     *  message()           {Function}
     */
    function Capture(options) {
        this.version = VERSION;
        this.defaults = {
            debug: false,
            events: [],
            config: null,
            provider: null,
            provider_config: null
        };
        extend(this, extend(this.defaults, options));
        this.debug = this.debug || /[?&]capture=true/.test(location.href);
        if (this.debug) {
            log('Initialized');
        }
        this.initialize.apply(this, arguments);
        if (this.debug) {
            log('Loaded', this);
        }
    }

    extend(Capture.prototype, {
        initialize: function (options) {
            var self = this;
            // Loop over config of events.
            if (self.debug) {
                log('Looping over events', self.config);
            }
            each(self.config, function (data) {
                // Create Event.
                self.createEvent(data, function (captureEvent) {
                    self.events[self.events.length] = captureEvent;
                });
            });
            if (!options.provider) {
                self.provider = new Provider({
                    debug: self.debug,
                    account: self.provider_config.account,
                    namespace: self.provider_config.namespace,
                    props: self.provider_config.props
                });
            }

        },
        createEvent: function (data, callback) {
            if (callback && typeof callback === 'function') {
                callback.call(this, new CaptureEvent(this, data));
            }
        },
        message: function (options) {
            var self = this;
            self.provider.send(options, function () {
                if (self.debug) {
                    log('Success');
                }
            });
        }
    });



    /**
     *  Provider
     *
     *  account             {String}
     *  initialize()        {Function}
     *  load()              {Function}
     *  send()              {Function}
     */
    function Provider(options) {
        this.defaults = {
            debug: false,
            account: '',
            namespace: 'ga',
            props: null
        };
        extend(this, extend(this.defaults, options));
        this.initialize.apply(this, arguments);
    }

    extend(Provider.prototype, {
        initialize: function () {
            this.load(this.account, this.props);
        },
        // Load Google Analytics Script.
        load: function (account, props) {
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments);
                },
                i[r].l = 1 * new Date();
                a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', this.namespace);
            root[this.namespace]('create', account, props);
            root[this.namespace]('send', 'pageview');
        },
        // Send data to Google Analytics
        send: function (options, callback) {
            var props = results(options.props, options.context);
            if (this.debug) {
                log('Sending', options.type, flatten(props).join(','));
            }
            props['hitCallback'] = callback;
            root[this.namespace]('send', options.type, props);
        }
    });



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