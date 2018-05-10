var HCtemplate = (function() {
    var instance = null;
    var startingTime = 0;
    var initialize = function() {
        return {
            getTemplate: function(data) {
                "use strict";
                var date = new Date(startingTime + parseInt(data.time));
                var formattedDate = date.getFullYear() + "-" + date.getDate() + "-" + date.getMonth() + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                return "<div id='hcm-" + data.id + "' class='hcc hc__m hc__message' itemtype='http://schema.org/Comment' itemscope='itemscope'>" +
                            "<div el='AvatarWrap' class='hcc hc__avatar'>" +
                                "<img el='Avatar' class='hcc' src='http://www.gravatar.com/avatar/57d465ed308e9ede910bada0fdf8417b?d=http://static.hypercomments.com/data/avatars/0/avatar.jpg' onerror='if(this.src != 'http://static.hypercomments.com/data/avatars/0/avatar')this.src='http://static.hypercomments.com/data/avatars/0/avatar';' title='" + data.name + "'></div>" +
                                "<div class='hcc hc__message__comment' el='Comment'>" +
                                    "<div class='hcc hc__message__header'>" + 
                                        "<span el='Nick' data-href='http://profile.hypercomments.com/null' class='hcc hc__nick' itemprop='author'>" + data.name + "</span>" +
                                        "<meta itemprop='dateCreated' content='" + formattedDate + "'>" +
                                        "<span class='hcc hc__time' el='Time'>" + date.getDate() + "." + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes() + "</span>" +
                                    "</div>" +
                                    "<div class='hcc hc__message__txt' el='Text' itemprop='text'>" + data.message + "</div>" +
                                    "<div el='FooterCom' class='hcc hc__message__footer'>" +
                                        "<div class='hcc hc__manager'>" +
                                            "<div class='hcc hc__manager__item' el='ReplyHc'>Ответить</div>" +
                                        "</div>" +
                                        "<span class='hcc' el='RTline'></span>" +
                                        "<div class='hcc hc__voting__amount'>" +
                                            "<div class='hcc hc__voting__total hc_unclick' el='Vt'></div>" +
                                            "<div class='hcc hc__voting__detail' el='VtD'>" +
                                            "<div class='hcc hc__voting__detail__plus' el='VtD_p'>+0</div>" +
                                            "<div class='hcc hc__voting__detail__min' el='VtD_m'>-0</div>" +
                                        "</div>" +
                                    "</div>" +
                                    "<div class='hcc hc__clear'></div>" +
                                "</div>" +
                            "</div>" +
                            "<div class='hcc hc__message__reply' el='ReplyForm'></div>" +
                        "</div>";
            },
            StartingTime: function(value) {
                "use strict";
                if (!arguments.length) return startingTime;
                else startingTime = value;
            }
        };
    };
    return {
        getIntance: function() {
            if (!instance) {
                instance = initialize();
            }
            return instance;
        }
    };
})();