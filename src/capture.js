/*
 *  capture.js
 *
 *  Description:
 *  Javascript tracking made easy.
 *  
 *  Current assumed dependencies:
 *  _ : Underscore
 *  $ : Zepto/Jquery
 */

(function (undefined) {

        
    var CommonJS = false,

        AMD = false,

        // Default properties.
        defaults = {
            debug: false,
            delay: false
        },
        
        // CaptureEvent default properties. 
        captureEventDefaults = {
            'id': -1,
            'selector': 'body',
            'action': 'click',
            'type': 'track',
            'props': {}
        },

        // Store CaptureEvents internally
        captureEvents = [],

        // Store Providers internally
        providers = [],

        // ## Internal Methods

        // ### Events
        // Mediator for Events shared throughout Capture.
        Events = function (options) {},
        // ### CaptureEvent
        // Class for CaptureEvents.
        CaptureEvent = function (options) {
            // Extend supplied options.
            extend(this, extend(captureEventDefaults, options)); 
        },
        // ### Provider
        // Class for Providers.
        Provider = function (options) {};


    // ## Capture 
    // 

    // ### Constructor
    function Capture(config, options) {
        //
        this.version = '0.0.1';
        //
        this.config = config;
        // Extend supplied options.
        extend(this, extend(defaults, options));
        //
        this.initialize.call(this);
    }

    // ### Capture prototype
    Capture.prototype = {
        // ##### Initialize
        initialize: function () {
            if ((typeof this.config !== 'undefined') && this.config.length) {
                for (var i = 0, j = this.config.length; i < j; i++) {
                    this.addCaptureEvent(this.config[i]);
                }   
            }
            
        },
        // ##### Add a CaptureEvent
        addCaptureEvent: function (capture_event) {
            captureEvents[captureEvents.length] = new CaptureEvent(capture_event);
            log.call(this, 'Added a new CaptureEvent ', captureEvents[captureEvents.length - 1]);
        },
        // ##### Remove a CaptureEvent
        removeCaptureEvent: function (id) {},
        // ##### Track
        track: function (options) {},
        // ##### Pageview
        pageview: function (options) {}

    };

    
    // ## Helper Methods

    // #### Log
    // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
    function log() {
        if (this.debug) {
            log.history = log.history || [];   // store logs to an array for reference
            log.history.push(arguments);
            if (window.console) {
                console.log(Array.prototype.slice.call(arguments));
            }     
        }
    }
        
    // #### Extend
    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }
        return a;
    }

    // #### Results
    // Pass in an object. If that object contains
    // function then they will be called.
    function results(obj, context) {
        var ctx = context || this;
        _.each(_.keys(obj), function (key) {
            if (typeof obj[key] === 'function') {
                obj[key] = obj[key].call(context);
            }
        });
        return obj;
    }

    // CommonJS
    if (typeof module !== 'undefined' && module.exports) { 
        module.exports = Capture;
        CommonJS = true;
    }

    // AMD
    if (typeof define === "function" && define.amd) {
        define("Capture", [], function () {
            return Capture;
        });
        AMD = true;
    }

    // expose to window
    if (!CommonJS && !AMD) {
        this.Capture = Capture;   
    }
    
}).call(this);