/*
 *  om.analytics.js
 *
 *  Description:
 *  Tracking made easy with Google Analytics.
 *  
 *  Dependencies:
 *  _ : Underscore
 *  $ : Zepto/Jquery
 */

(function (undefined) {

    var capture,
        VERSION = "0.0.1",

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    // Capture
    // ---------------------
    //
    function Capture(options) {
        extend(this, options);
    }

        

    // helpers

    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }
        return a;
    }

    // Common JS module is defined
    if (hasModule) { 
        module.exports = capture;
    }

    if (typeof define === "function" && define.amd) {
        define("capture", [], function () {
            return capture;
        });
    }


}).call(this);







// ;(function($, _) {
    
//     'use strict';

//     var Events = {

//         trigger: function(name, options, context) {

//             console.log(options.id, name, options, context);

//         }

//     };


//     /*
//     var Provider = function (options) {};

//     _.extend(Provider.prototype, {

//         track: function(options) {},

//         pageview: function(options) {}

//     });


    
//     var GAQProvider = Provider.extend({

//         track: function(options) {},

//         pageview: function(options) {}

//     });
//     */
    


//     /**
//      *  
//      *  
//      *  
//      *  
//      */
//     var Capture = function (options) {

//         this._configure(options || {});
//         this.initialize.apply(this, arguments);

//         console.log(this);

//     };

//     var baseOptions = ['debug', 'delay', 'config'];

//     _.extend(Capture.prototype, Events, {

//         //
//         debug: false,

//         // should there be a delay on the events
//         delay: false,

//         /**
//          *
//          *
//          *
//          */
//         initialize: function () {

//             _.each(this.config, function(node) {
//                 new CaptureEvent(node);
//             });

//         },

//         /**
//          *
//          *
//          *
//          */
//         track: function() {},
//         // track: function (options) {

//         //     var opts = options || {},
//         //         category = opts.category || '',
//         //         action = opts.action || '',
//         //         opt_label = opts.opt_label || '',
//         //         opt_value = parseInt(opts.opt_value) || 0,
//         //         opt_noninteraction = opts.opt_noninteraction || false;

//         //     //_gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);

//         //     console.log('track', category, action, opt_label, opt_value, opt_noninteraction);   
//         // },

//         /**
//          *
//          *
//          *
//          */
//         pageview: function() {},
//         // pageview: function (options) {
//         //     var opts = options,
//         //         url = opts.url || document.location.pathname;

//         //     //_gaq.push(['_trackPageview', url]);

//         //     console.log('pageview', value);
//         // },

//         /**
//          * 
//          *
//          *
//          */
//         _configure: function(options) {
//             if(this.options) {
//                 options = _.extend({}, _.result(this, 'options'), options);
//             }
//             _.extend(this, _.pick(options, baseOptions));
//             this.options = options;
//          }

//     });
    

    


//     /**
//      *  @param {id}
//      *  @param {action}
//      *  @param {type}
//      *  @param {props}
//      */
//     var CaptureEvent = function (options) {
        
//         var opts = options || {};

//         this.cid = _.uniqueId('event');
//         this.selector = opts.selector;
//         this.id = opts.id || this.cid;
//         this.action = opts.action;
//         this.type = opts.type;
//         this.props = opts.props;

//         if(!this.selector) {
//             throw new Error('CaptureEvent –- Please provide a selector.');
//         }
        
//         if(typeof this.type === 'string') {
//             this.type = this.type.split();
//         }

//         this.initialize.apply(this, arguments);
//     };

//     // valid events should be user interactions  
//     var eventActions = ['click', 'hover', 'swipe', 'touch'];

//     // valid event Types    
//     var eventTypes = ['track', 'pageview'];

//     // extend CaptureEvent
//     _.extend(CaptureEvent.prototype, Events, {

//         initialize: function () {

//             this.$el = $(this.selector);

//             _.bindAll(this, 'triggerEvent');

//             this.$el.on(this.action, this.triggerEvent);

//         },

//         /**
//          *
//          */
//         triggerEvent: function (e) {

//             var self = this;

//             e.preventDefault();

//             _.each(self.type, function(type){

//                 self.trigger('capture', {
//                     id: self.id,
//                     type: type,
//                     props: self.results(self.props, e.currentTarget),
//                     callback: function() {}
//                 }, e.currentTarget);
                   
//             });
            
//         },

//         /**
//          *  If an obj contains a function
//          *  call the function.
//          */
//         results: function(obj, context) {
//             var ctx = context || this;
//             _.each(_.keys(obj), function(key) {
//                 if(typeof obj[key] === 'function') {
//                     obj[key] = obj[key].call(context);
//                 }
//             });
//             return obj;
//         }

//     });
    
//     window.Events = Events;
//     window.CaptureEvent = CaptureEvent;
//     window.Capture = Capture;

// })(this.$, this._);