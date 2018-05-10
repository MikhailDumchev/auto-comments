var constants = (function() {
    "use strict";
    var instance = null;
    function init() {
        var userCookieTitle = "ys-object";
        return {
            getCookieTitles: function() {
                return {"object": userCookieTitle};
            }
        };
    }
    return {
        getInstance: function() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
})();