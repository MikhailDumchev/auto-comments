function Handler() {
    "use strict";
    var startingTime = 0;
    this.StartingTime = function(value) {
        if (!arguments.length) return startingTime;
        else startingTime = value;
    };
    var initialFileAddress = "test.json";
    //var handlerAddress = "http://air2.yaroslav-samoylov.com/admin/time";
    var handlerAddress = "http://air.yaroslav-samoylov.com/live/test/time.php";
    //Массив с ссылками на изображения;
    var images = [
        {"name": "Ярослава", "image": "yaroslava.jpg"},
        {"name": "Иванна", "image": "ivanna.jpg"},
        {"name": "Алиса", "image": "alice.jpg"},
        {"name": "Галина", "image": "galina.jpg"},
        {"name": "Дина", "image": "dinah.jpg"},
        {"name": "Елена Акимушкина", "image": "helena.jpg"},
        {"name": "Алена", "image": "helena-1.jpg"}
    ];
    var getNames = function(comments) {
        var targets = [];
        var indicator = false;
        var internalCounter = 0;
        for (var counter = 0; counter < comments.length; counter++) {
            while (!indicator && internalCounter < targets.length) {
                if (targets[internalCounter] === comments[counter].name) indicator = true;
                internalCounter++;
            }
            if (!indicator) {
                targets.push(comments[counter].name);
            } else {
                indicator = false;
            }
            internalCounter = 0;
        }
        return targets;
    };
    var createAuthors = function(comments) {
        var targets = [];
        var indicator = false;
        var internalCounter = 0;
        //Счётчик отображает количество авторов;
        var additoryCounter = 0;
        var additoryVariable = new Object();
        for (var counter = 0; counter < comments.length; counter++) {
            while (!indicator && internalCounter < targets.length) {
                if (targets[internalCounter].name === comments[counter].name) indicator = true;
                internalCounter++;
            }
            //Если имя ещё не было занесено в массив;
            if (!indicator) {
                internalCounter = 0;
                additoryVariable.name = comments[counter].name;
                additoryVariable.authorID = "bot-" + additoryCounter;
                //Проход по массиву с изображениями;
                while (!indicator && internalCounter < images.length) {
                    if (additoryVariable.name === images[internalCounter].name) {
                        additoryVariable.image = "img/" + images[internalCounter].image;
                        indicator = true;
                    }
                    internalCounter++;
                }
                //Если для пользователя не задана аватарка;
                if (!indicator) additoryVariable.image = "http://cackle.me/widget/img/anonym2.png";
                else indicator = false;
                targets.push(additoryVariable);
                additoryCounter++;
            } else {
                indicator = false;
            }
            additoryVariable = new Object();
            internalCounter = 0;
        }
        return targets;
    };
    var processTime = function(time) {
        var result = time.split(":");
        return result[2] * 1000 + result[1] * 60000 + result[0] * 3600000 + startingTime;
    };
    var addQuote = function(key, value) {
        return "\"" + key + "\":\"" + screening(value) + "\"";
    };
    var screening = function(value) {
        var pattern = /"/ig;
        return value.toString().replace(pattern, "\\\"");
    };
    var display = function(comment) {
        var outputElementID = "output";
        var element = document.getElementById(outputElementID);
        var result = "{";
        var propertiesAmount = Object.keys(comment).length;
        var counter = 0;
        for (var key in comment) {
            result += addQuote(key, comment[key]);
            if (counter < propertiesAmount - 1) result += ",";
            counter++;
        }
        result+= "},</br>";
        element.innerHTML += result;
    };
    this.getCurrentTime = function() {
        var XHR = new XMLHttpRequest();
        XHR.onreadystatechange = function() {
            var response = new Object();
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    response = JSON.parse(XHR.responseText);
                    startingTime = parseInt(response.start);
                    this.sendRequest();
                }
            }
        }.bind(this);
        XHR.open("GET", handlerAddress, true);
        XHR.send();
    };
    this.sendRequest = function() {
        var XHR = new XMLHttpRequest();
        XHR.onreadystatechange = function() {
            var response = new Object();
            var additoryVariable = new Object();
            var authors = new Array();
            var result = new Array();
            var counter = 0;
            var internalCounter = 0;
            var additoryCounter = 0;
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    console.log(startingTime);
                    response = JSON.parse(XHR.responseText);
                    authors = createAuthors(response.comments);
                    for (counter = 0; counter < response.comments.length; counter++) {
                        for (internalCounter = 0; internalCounter < authors.length; internalCounter++) {
                            if (response.comments[counter].name === authors[internalCounter].name) {
                                additoryVariable.time = processTime(response.comments[counter].time);
                                additoryVariable.name = authors[internalCounter].name;
                                additoryVariable.message = response.comments[counter].message;
                                additoryVariable.id = additoryCounter;
                                additoryVariable.authorID = authors[internalCounter].authorID;
                                additoryVariable.image = authors[internalCounter].image;
                                result.push(additoryVariable);
                                display(result[result.length - 1]);
                            }
                        }
                        additoryCounter++;
                        additoryVariable = new Object();
                    }
                } else notify("К сожалению, возникла ошибка при получении AJAX-ответа;");
            }
        };
        XHR.open("GET", initialFileAddress, true);
        XHR.send();
    };
};