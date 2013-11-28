function monthInWeeks(currDate, startWeek) {
    // Day week starts: 0 - Sunday, 1 - Monday and so on.
    // 0 - Sunday by default.
    startWeek = startWeek || 0;
    startWeek %= 7;

    var daysInWeeks = new Array();
    // First day of month defined by given date currDate
    var d = new Date(currDate.getYear(), currDate.getMonth(), 1);
    // If 1st day of month is not the start of the week
    if (d.getDay() != startWeek) {
        // Look for latest start of the week in previous month
        d.setDate(d.getDate() - d.getDay() + startWeek);
        }

    var i = 0;
    // All weeks with this month days
    while (d.getMonth() <= currDate.getMonth()) {
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

var today = new Date();

function createCalendar(placeId, dayDate){
    // Calendar layout
    var place = document.getElementById(placeId);
    var container = setNode("div", place, CSS_REF.container);
    var field = setNode("div", container, CSS_REF.field);
    var monthHeader = setNode("div", field, CSS_REF.monthHeader);
    var arrowBack = setNode("span", monthHeader, CSS_REF.arrowBack,
                            CONT.arrowBack);
    var monthInst = setNode("span", monthHeader, '',
                            CONT.monthNames[dayDate.getMonth()]);
    var yearInst = setNode("span", monthHeader, '',
                           today.getFullYear());
    var arrowForward = setNode("span", monthHeader, CSS_REF.arrowForward,
                               CONT.arrowForward);
    var monthBody = setNode("div", field);

    var days = monthInWeeks(dayDate);
    var week = setNode("div", monthBody);
    fillWeek(week, CONT.dayShortNames, true);
    for (var i = 0; i < days.length; i++) {
        week = setNode("div", monthBody);
        fillWeek(week, days[i], false, i);
    }
}

