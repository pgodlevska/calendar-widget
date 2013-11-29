function monthInWeeks(currDate, startWeek) {
    // Day week starts: 0 - Sunday, 1 - Monday and so on.
    // 0 - Sunday by default.
    startWeek = startWeek || 0;
    startWeek %= 7;

    var daysInWeeks = new Array();
    // First day of month defined by given date currDate
    var d = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
    var firstOfNext = new Date(currDate.getFullYear(),
                               currDate.getMonth() + 1, 1);
    // If 1st day of month is not the start of the week
    if (d.getDay() != startWeek) {
        // Look for latest start of the week in previous month
        d.setDate(d.getDate() - d.getDay() + startWeek);
        }
    var i = 0;
    // All weeks with this month days
    alert
    while (d < firstOfNext) {
        daysInWeeks[i] = new Array();
        // Arrange days in weeks
        for (var j = 0; j < 7; j++) {
            daysInWeeks[i][j] = d.getDate();
            d.setDate(d.getDate() + 1)
        }
        i++;
   }
   return daysInWeeks;
}

function dateString(dateSource) {
    var dateString;
    dateString = dateSource.getFullYear().toString();
    dateString += "-";
    dateString += ("0" + (dateSource.getMonth() + 1).toString()).slice(-2);
    dateString += "-";
    dateString += ("0" + dateSource.getDate().toString()).slice(-2);
    return dateString;
}

function dateFromString(dateString) {
    date = new Date();
    date.setFullYear(parseInt(dateString.substring(0,4)));
    date.setMonth(parseInt(dateString.substring(5,7)) - 1);
    date.setDate(parseInt(dateString.substring(8,10)));
    return date;
}

function setNode(nodeType, nodeParent, nodeClass, nodeContent) {
    var newNode = document.createElement(nodeType);
    nodeParent.appendChild(newNode);
    if (nodeClass) {
        newNode.className = nodeClass;
    }
    if (nodeContent) {
        newNode.innerHTML = nodeContent;
    }
    return newNode;
}


function fillWeek(weekNode, daysArray, letters, weekNo) {
    letters = letters || false;
    var day;
    var today = new Date();
    for (var i = 0; i < 7; i++) {
        day = setNode("span", weekNode, CSS_REF.day, daysArray[i]);
        if (letters) {
            day.className += CSS_REF.sequelDayOfWeek;
        } else {
            // Find days from other months
            if (weekNo < 1 && daysArray[i] > 7 ||
                weekNo > 1 && daysArray[i] < 7) {
                day.className += CSS_REF.sequelDayNotMonth;
            } else {
                day.className += CSS_REF.sequelDayRegular;
                //TODO: Today only in current month
                // Maybe somewhere out, because regular days
                // should be accessed later anyway
                if (daysArray[i] == today.getDate()) {
                    day.className += CSS_REF.sequelDayToday;
                }
            }
        }
        if (i == 0) {
            day.className += CSS_REF.sequelDayFirst;
        } else if (i == 6) {
            day.className += CSS_REF.sequelDayLast;
        }
    }
}

function renderMonth(dateSource) {
    var days = monthInWeeks(dateSource);
    var monthDays = document.createElement("div");
    for (var i = 0; i < days.length; i++) {
        week = setNode("div", monthDays);
        fillWeek(week, days[i], false, i);
    }
    return monthDays;
}

function switchMonth(dateSource) {
    var monthInst = document.getElementById(DOM_ID.monthInst);
    monthInst.innerHTML = CONT.monthNames[dateSource.getMonth()];
    var yearInst = document.getElementById(DOM_ID.yearInst);
    yearInst.innerHTML = dateSource.getFullYear();
    var monthBody = document.getElementById(DOM_ID.monthBody);
    var monthDays = renderMonth(dateSource);
    monthBody.replaceChild(monthDays, monthBody.lastChild);
}

/* CSS reference */
var CSS_REF = {
    container: "cw-container",
    field: "cw-field",
    monthHeader: "cw-month-head",
    arrowBack: "cw-arrow-back",
    arrowForward: "cw-arrow-forward",
    day: "cw-day",
    sequelDayFirst: " first",
    sequelDayLast: " last",
    sequelDayOfWeek: " of-week",
    sequelDayNotMonth: " not-month",
    sequelDayRegular: " regular",
    sequelDayToday: " today"
};

DOM_ID ={
    arrowBack: "arrow_back",
    arrowForward: "arrow_forward",
    monthInst: "month_name",
    yearInst: "year_name",
    monthBody: "month_body"};

/* Content Constants */
var CONT = {
    arrowBack: "&#9668;",
    arrowForward: "&#9658;",
    monthNames: ["January", "February", "March", "April",
                  "May", "June", "July", "August",
                  "September", "October", "November", "December"
                 ],
    dayShortNames: ["S", "M", "T", "W", "T", "F", "S"]
};

function createCalendar(container, dateSource){
    // Calendar layout
    container.className = CSS_REF.container;
    var field = setNode("div", container, CSS_REF.field);
    var monthHeader = setNode("div", field, CSS_REF.monthHeader);
    var arrowBack = setNode("span", monthHeader, CSS_REF.arrowBack,
                            CONT.arrowBack);
    var monthInst = setNode("span", monthHeader, '',
                            CONT.monthNames[dateSource.getMonth()]);
    var yearInst = setNode("span", monthHeader, '',
                           dateSource.getFullYear());
    var arrowForward = setNode("span", monthHeader, CSS_REF.arrowForward,
                               CONT.arrowForward);
    var monthBody = setNode("div", field);

    var weekHead = setNode("div", monthBody);
    fillWeek(weekHead, CONT.dayShortNames, true);
    var monthDays = renderMonth(dateSource);
    monthBody.appendChild(monthDays);
    arrowBack.id = DOM_ID.arrowBack;
    arrowForward.id = DOM_ID.arrowForward;
    monthInst.id = DOM_ID.monthInst;
    yearInst.id = DOM_ID.yearInst;
    monthBody.id = DOM_ID.monthBody;
}

window.onload = function() {
    var currentDate;
    var dateInput = document.getElementById("date_input");
    if (dateInput.value) {
        currentDate = dateFromString(dateInput.value);
    } else {
        currentDate = new Date();
    }
    var container = document.createElement("div");
    dateInput.parentNode.insertBefore(container, dateInput.nextSibling);
    dateInput.onfocus = function() {
        if (!container.hasChildNodes()) {
            createCalendar(container, currentDate);
            var monthBody = document.getElementById(DOM_ID.monthBody);
            var monthBack = document.getElementById(DOM_ID.arrowBack);
            monthBack.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() - 1);
                switchMonth(currentDate);
            };
            var monthBack = document.getElementById(DOM_ID.arrowForward);
            monthBack.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() + 1);
                switchMonth(currentDate);
            };
            monthBody.onclick = function(e) {
                var day = e.target;
                var dayClass = day.className;
                if (dayClass.indexOf(CSS_REF.sequelDayRegular) != -1) {
                    currentDate.setDate(day.innerHTML);
                    var chosen = dateString(currentDate);
                    dateInput.value = chosen;
                    container.style.display = "none";
                }
            };
        }
        container.style.display = "block";
    };
    //dateInput.onblur = function() {
    //    container.style.display = "none";
    //};
}
