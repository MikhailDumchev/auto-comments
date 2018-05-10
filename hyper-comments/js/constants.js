var constants = (function() {
    "use strict";
    var instance = null;
    function init() {
        var timeCookieTitle = "ys-time";
        var userCookieTitle = "ys-object";
        return {
            getCookieTitles: function() {
                return {"time": timeCookieTitle, "object": userCookieTitle};
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