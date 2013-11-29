function monthInWeeks(dateSource, startWeek) {
    // Day week starts: 0 - Sunday, 1 - Monday and so on till 6 - Saturday.
    // 0 - Sunday by default.
    startWeek = startWeek || 0;

    var daysInWeeks = new Array();
    // First day of month defined by given date dateSource
    var d = new Date(dateSource.getFullYear(), dateSource.getMonth(), 1);
    var firstOfNextMonth = new Date(dateSource.getFullYear(),
                                    dateSource.getMonth() + 1, 1);
    // If 1st day of month is not the start of the week
    // Look for latest start of the week in previous month
    if (d.getDay() != startWeek) {
        d.setDate(d.getDate() - d.getDay() + startWeek);
        }

    var i = 0;
    // All weeks with this month days
    while (d < firstOfNextMonth) {
        // Arrange days in weeks
        daysInWeeks[i] = new Array();
        for (var j = 0; j < 7; j++) {
            daysInWeeks[i][j] = d.getDate();
            d.setDate(d.getDate() + 1);
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


function setNode(nodeType, nodeParent, nodeClass, nodeContent, nodeId) {
    var newNode = document.createElement(nodeType);
    nodeParent.appendChild(newNode);
    if (nodeClass) {
        newNode.className = nodeClass;
    }
    if (nodeContent) {
        newNode.innerHTML = nodeContent;
    }
    if (nodeId) {
        newNode.id = nodeId;
    }
    return newNode;
}


function fillWeek(weekNode, daysArray, letters) {
    letters = letters || false;

    var day;
    for (var i = 0; i < 7; i++) {
        day = setNode("span", weekNode, CSS_REF.day, daysArray[i]);
        if (letters) {
            day.className += CSS_REF.sequelDayOfWeek;
        }
        if (i == 0) {
            day.className += CSS_REF.sequelDayFirst;
        } else if (i == 6) {
            day.className += CSS_REF.sequelDayLast;
        }
    }
}


function renderMonth(dateSource) {
    var today = new Date();
    var days = monthInWeeks(dateSource);
    var monthDays = document.createElement("div");

    for (var i = 0; i < days.length; i++) {
        week = setNode("div", monthDays);
        fillWeek(week, days[i]);
        daySpans = week.getElementsByTagName("span");
        for (var j = 0; j < daySpans.length; j++) {
            dayNo = parseInt(daySpans[j].innerHTML);
            // Find days not from rendered month
            if (i < 1 && dayNo > 7 ||
                i > 1 && dayNo < 7) {
                daySpans[j].className += CSS_REF.sequelDayNotMonth;
            } else {
                daySpans[j].className += CSS_REF.sequelDayRegular;
                // Find and highlight today
                if (dateSource.getFullYear() == today.getFullYear() &&
                    dateSource.getMonth() == today.getMonth() &&
                    dayNo == today.getDate()) {
                        daySpans[j].className += CSS_REF.sequelDayToday;
                }
            }
        }
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

/* Needed ID's */
DOM_ID ={
    arrowBack: "arrow_back",
    arrowForward: "arrow_forward",
    monthInst: "month_name",
    yearInst: "year_name",
    monthBody: "month_body"
};

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

    // Month Header
    var monthHeader = setNode("div", field, CSS_REF.monthHeader);
    var arrowBack = setNode("span", monthHeader, CSS_REF.arrowBack,
                            CONT.arrowBack, DOM_ID.arrowBack);
    var monthInst = setNode("span", monthHeader, '',
                            CONT.monthNames[dateSource.getMonth()],
                            DOM_ID.monthInst);
    var yearInst = setNode("span", monthHeader, '',
                           dateSource.getFullYear(), DOM_ID.yearInst);
    var arrowForward = setNode("span", monthHeader, CSS_REF.arrowForward,
                               CONT.arrowForward, DOM_ID.arrowForward);

    // Month
    var monthBody = setNode("div", field, '', '', DOM_ID.monthBody);
    // Header with week days
    var weekHead = setNode("div", monthBody);
    fillWeek(weekHead, CONT.dayShortNames, true);
    // Month days
    var monthDays = renderMonth(dateSource);
    monthBody.appendChild(monthDays);
}


window.onload = function() {
    var dateInput = document.getElementById("date_input");
    var currentDate;
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
            // Month back handler
            var monthBack = document.getElementById(DOM_ID.arrowBack);
            monthBack.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() - 1);
                switchMonth(currentDate);
            };
            // Month forward handler
            var monthBack = document.getElementById(DOM_ID.arrowForward);
            monthBack.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() + 1);
                switchMonth(currentDate);
            };
            // Pick a date handler
            var monthBody = document.getElementById(DOM_ID.monthBody);
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
            // Hide calendar
            document.onclick = function(e) {
                target = e.target;
                var show = false;
                while (target != this) {
                    if (target == container || target == dateInput) {
                        show = true;
                        break;
                    }
                   target = target.parentNode;
                }
                if (!show) {
                    container.style.display = "none";
                }
            };
        }
        container.style.display = "block";
    };
}

