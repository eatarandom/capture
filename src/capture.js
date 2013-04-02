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

    var capture,

        // Version
        VERSION = "0.0.1",

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    // ### Capture

    function Capture(options) {
        extend(this, options);
    }

        
    // ### Extend

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