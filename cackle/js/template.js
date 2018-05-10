var template = (function() {
    var setDeclension = function(number) {  
        var cases = [2, 0, 1, 1, 1, 2];
        var titles = ["минуту", "минуты", "минут"];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];  
    };
    return {
        getTemplate: function(data) {
            "use strict";
            var date = new Date(data.time);
            var formattedDate = date.getFullYear() + "-" + date.getDate() + "-" + date.getMonth() + "T" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
            return  "<div class='mc-comment' style='overflow: hidden !important;' id='cc-" + data.id +"' data-author-id='" + data.authorID + "' itemtype='http://schema.org/Comment' itemscope='itemscope'>" +
                        "<div class='mc-comment-wrap mc-comment-approved'>" +
                            "<div class='mc-comment-light'></div>" +
                            "<div class='mc-comment-user'>" +
                                "<a href='javascript:void(0)' class='mc-comment-author'>" +
                                    "<div class='mc-avatar-wrap'>" +
                                        "<img src='" + data.image + "' class='mc-avatar' onerror='if(this.src!='http://cackle.me/widget/img/anonym2.png')this.src='http://cackle.me/widget/img/anonym2.png';'>" +
                                    "</div>" +
                                "</a>" +
                            "</div>" +
                            "<div class='mc-comment-info'>" +
                                "<div class='mc-comment-head'>" +
                                    "<span class='mc-comment-username' data-author-id='" + data.authorID + "' itemprop='author'>" + data.name + "</span>" +
                                    "<meta itemprop='dateCreated' content='" + formattedDate + "'>" +
                                    "<a href='http://air.yaroslav-samoylov.com/live/com.php#cc-" + data.id + "' class='mc-comment-time' timestamp='" + data.time + "'>только что</a>" +
                                "</div>" +
                                "<div class='mc-comment-body'>" +
                                    "<div class='mc-comment-inner' data-msg='" + data.message + "' data-media=''>" +
                                        "<div class='mc-comment-msgcnt'><div class='mc-comment-msg' itemprop='text'>" + data.message + "</div>" +
                                    "</div>" +
                                    "<a class='mc-comment-seemore' style='display:none'>показать больше</a>" +
                                "</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>";
        }
    };
}());