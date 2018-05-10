var ajaxHandler = (function() {
    //URL-адресс списка авто-комментариев;
    var dataFileAddress = "data.json?v=1.0.1";
    //URL-адресс обработчика, который определяет текущее серверное и стартовое время;
    var handlerAddress = "time.php?v=1.0.1";
    var containerID = "hypercomments_widget";
    var internalContainerClassName = "hc__messages";
    var container = new Object();
    var nextCommentNumber = 0;
    var internalContainer = new Object();
    //Ссылка на объект-шаблон, который является представлением авто-комментария;
    var template = new Object();
    //В переменной содержится массив всех авто-комментариев, а также текущее серверное время;
    var data = new Object();
    var Data = function(value) {
        "use strict";
        if (!arguments.length) return data;
        else data = value;
    };
    var indicator = false;
    var startingTime = 0;
    var currentTime = 0;
    //Значение временного сдвига (ускорение или задержка);
    var shift = 0;
    /*
     * Установка начальных значений для текущего серверного и стартового времени;
     * @param {function} callback
     */
    var getCurrentTime = function(callback) {
        sendRequest(handlerAddress, function(value) {
            if (!startingTime) startingTime = parseInt(value.start);
            if (!currentTime) currentTime = parseInt(value.server);
            template.StartingTime(startingTime);
            console.log(startingTime, currentTime);
            if (callback) callback();
        });
    };
    /*
     * Получение JSON-списка комментариев;
     * @param {function} callback
     */
    var getData = function(callback) {
        "use strict";
        sendRequest(dataFileAddress, function(value) {
            Data(value);
            if (callback) callback();
        });
    };
    /*
     * Анимация при добавлении авто-комментария;
     */
    var animateHeightIncrease = function() {
        "use strict";
        var comment = document.getElementById("hcm-" + data.comments[nextCommentNumber].id);
        var height = parseFloat(window.getComputedStyle(comment, "").height);
        comment.style.cssText = "height: 0px; transition: height 0.2s !important; -webkit-transition: height 0.2s !important; overflow: hidden; opacity: 0;";
        window.setTimeout(function() {
            comment.style.opacity = 1;
            comment.style.height = height + "px";
            comment.addEventListener("transitionend", handleEvent, false);
            comment.addEventListener("webkitTransitionEnd", handleEvent, false);
            comment.addEventListener("otransitionend", handleEvent, false);
        }.bind(this), 1000);
    };
    var getTemplate = function() {
        "use strict";
        return template.getTemplate(data.comments[nextCommentNumber]);
    };
    var handleEvent = function(event) {
        "use strict";
        event = event || window.event;
        if (event.type === "transitionend" || event.type === "webkitTransitionEnd" || event.type === "otransitionend") {
            event.target.removeAttribute("style");
            event.target.removeEventListener("transitionend", handleEvent, false);
            event.target.removeEventListener("webkitTransitionEnd", handleEvent, false);
            event.target.removeEventListener("otransitionend", handleEvent, false);
        }
    };
    /*
     * Рекурсивное добавление авто-комментариев;
     */
    var scheduleCommentAddition = function(time) {
        "use strict";
        window.setTimeout(function() {
            getTemplate();
            if (!indicator) removeInfoModule();
            internalContainer.insertAdjacentHTML("afterbegin", getTemplate());
            animateHeightIncrease();
            nextCommentNumber++;
            if (nextCommentNumber < data.comments.length) {
                //Отложенное добавление комментария на основании временной разницы
                //между соседними комментариями;
                scheduleCommentAddition(parseInt(data.comments[nextCommentNumber].time) - parseInt(data.comments[nextCommentNumber - 1].time));
            }
        }.bind(this), time);
    };
    /*
     * Определение порядкового номера комментария, который будет добавлен первым,
     * а также запуск рекурсивного добавления авто-комментариев;
     */
    var startCommentAddition = function() {
        "use strict";
        var counter = 0;
        var indicator = false;
        //Определение порядкового номера следующего авто-комментария;
        while (!indicator && counter < data.comments.length) {
            //Если время добавления следующего авто-комментария больше, чем
            //текущее серверное время, поиск останавливается;
            if (currentTime < startingTime + parseInt(data.comments[counter].time)) {
                indicator = true;
                nextCommentNumber = counter;
            } else counter++;
        }
        if (indicator) {
            //Определение задержки или ускорения перед добавлением следующего
            //авто-комментария;
            shift = startingTime - currentTime;
            scheduleCommentAddition(parseInt(data.comments[nextCommentNumber].time) + shift);
            console.log("Добавление авто-комментариев начнётся через: " + (parseInt(data.comments[nextCommentNumber].time) + shift));
        }
    };
    /*
     * Отправка AJAX-запроса для получения текущего серверного и стартового времени;
     * @param {function} callback
     */
    var sendRequest = function(handlerAddress, callback) {
        "use strict";
        var XHR = new XMLHttpRequest();
        XHR.onreadystatechange = function() {
            var response = new Object();
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    response = JSON.parse(XHR.responseText);
                    if (callback) callback(response);
                } else notify("К сожалению, возникла ошибка при получении AJAX-ответа;");
            }
        };
        XHR.open("GET", handlerAddress, true);
        XHR.send();
    };
    var removeInfoModule = function() {
        "use strict";
        var infoModuleClassName = "mc-nocomments";
        var additoryVariable = selectElementByClassName(infoModuleClassName, container);
        if (additoryVariable.status) {
            additoryVariable.element.parentNode.removeChild(additoryVariable.element);
            indicator = true;
        }
    };
    return {
        /*
         * Получение ссылок на целевые HTML-элементы сервиса Cackle;
         */
        initialize: function() {
            "use strict";
            var additoryVariable = new Object();
            if (document.getElementById(containerID)) {
                container = document.getElementById(containerID);
                additoryVariable = selectElementByClassName(internalContainerClassName, container);
                if (additoryVariable.status) {
                    internalContainer = additoryVariable.element;
                } else notify(internalContainerClassName, 1);
            } else notify(containerID, 3);
        },
        /*
         * Запуск;
         */
        start: function() {
            "use strict";
            //Получение текущего серверного времени;
            getCurrentTime(function() {
                //Получение списка авто-комментариев;
                getData(startCommentAddition);
            });
        },
        /*
         * Получение ссылки на объект-шаблон, который является представлением
         * авто-комментария;
         */
        Template: function(value) {
            "use strict";
            if (!arguments.length) return template;
            else template = value;
        },
        commentsCustomization: function() {
            "use strict";
            var commentClassName = "mc-comment";
            var targets = ["mc-comment-reply", "mc-comment-menu", "mc-comment-vote"];
            var counter = 0;
            var internalCounter = 0;
            var additoryVariable = new Object();
            var comments = new Object();
            if (container.toString() !== "[object Object]") comments = container.getElementsByClassName(commentClassName);
            else comments = document.getElementsByClassName(commentClassName);
            if (comments.length) {
                for (counter = 0; counter < comments.length; counter++) {
                    for (internalCounter = 0; internalCounter < targets.length; internalCounter++) {
                        additoryVariable = selectElementByClassName(targets[internalCounter], comments[counter]);
                        if (additoryVariable.status) {
                            additoryVariable.element.parentNode.removeChild(additoryVariable.element);
                        }
                    }
                }
            }
        },
        CurrentTime: function(value) {
            if (!arguments.length) return currentTime;
            else currentTime = value;
        },
        StartingTime: function(value) {
            if (!arguments.length) return startingTime;
            else startingTime = value;
        }
    };
}());