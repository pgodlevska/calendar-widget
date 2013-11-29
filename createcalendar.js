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
    var patt = new RegExp("^([0-9]{4}).([0-9]{2}).([0-9]{2})");
    var found = dateString.match(patt);
    if (found) {
        var date = new Date();
        date.setFullYear(parseInt(found[1]));
        date.setMonth(parseInt(found[2]) - 1);
        date.setDate(parseInt(found[3]));
        return date;
    } else {
        return null;
    }
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


function switchMonth(dateSource, suffix) {
    var monthInstId = DOM_ID.monthInst + suffix;
    var monthInst = document.getElementById(monthInstId);
    monthInst.innerHTML = CONT.monthNames[dateSource.getMonth()];
    var yearInstId = DOM_ID.yearInst + suffix;
    var yearInst = document.getElementById(yearInstId);
    yearInst.innerHTML = dateSource.getFullYear();
    var monthBodyId = DOM_ID.monthBody + suffix;
    var monthBody = document.getElementById(monthBodyiId);
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
    arrowBack: "arrow_back_",
    arrowForward: "arrow_forward_",
    monthInst: "month_name_",
    yearInst: "year_name_",
    monthBody: "month_body_"
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


function createCalendar(container, dateSource, idSuffix){
    // Calendar layout
    container.className = CSS_REF.container;
    var field = setNode("div", container, CSS_REF.field);

    // Month Header
    var monthHeader = setNode("div", field, CSS_REF.monthHeader);
    var arrowBackId = DOM_ID.arrowBack + idSuffix;
    var arrowBack = setNode("span", monthHeader, CSS_REF.arrowBack,
                            CONT.arrowBack, arrowBackId);
    var monthInstId = DOM_ID.monthInst + idSuffix;
    var monthInst = setNode("span", monthHeader, '',
                            CONT.monthNames[dateSource.getMonth()],
                            monthInstId);
    var yearInstId = DOM_ID.yearInst + idSuffix;
    var yearInst = setNode("span", monthHeader, '',
                           dateSource.getFullYear(), yearInstId);
    var arrowForwardId = DOM_ID.arrowForward + idSuffix;
    var arrowForward = setNode("span", monthHeader, CSS_REF.arrowForward,
                               CONT.arrowForward, arrowForwardId);

    // Month
    var monthBodyId = DOM_ID.monthBody + idSuffix;
    var monthBody = setNode("div", field, '', '', monthBodyId);
    // Header with week days
    var weekHead = setNode("div", monthBody);
    fillWeek(weekHead, CONT.dayShortNames, true);
    // Month days
    var monthDays = renderMonth(dateSource);
    monthBody.appendChild(monthDays);
}


function attachCalendar(dateInputId) {
    var dateInput = document.getElementById(dateInputId);

    var container = document.createElement("div");
    xOffset = dateInput.getBoundingClientRect().left;
    container.style.left = xOffset;
    dateInput.parentNode.insertBefore(container, dateInput.nextSibling);

    var currentDate;
    if (dateInput.value && dateFromString(dateInput.value)) {
        currentDate = dateFromString(dateInput.value);
    } else {
        currentDate = new Date();
    }

    dateInput.onfocus = function() {
        if (!container.hasChildNodes()) {
            createCalendar(container, currentDate, dateInputId);

            // Month back handler
            var arrowBackId = DOM_ID.arrowBack + dateInputId;
            var monthBack = document.getElementById(arrowBackId);
            monthBack.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() - 1);
                switchMonth(currentDate, dateInputId);
            };

            // Month forward handler
            var arrowForwardId = DOM_ID.arrowForward + dateInputId;
            var monthForward = document.getElementById(arrowForwardId);
            monthForward.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() + 1);
                switchMonth(currentDate, dateInputId);
            };

            // Pick a date handler
            var monthBodyId = DOM_ID.monthBody + dateInputId;
            var monthBody = document.getElementById(monthBodyId);
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
            //TODO: hanlders for month select and year select
            //TODO: put hadlers out of here
        }

        // Allow created calendar, disable user input
        container.style.display = "block";
        this.onkeyup = function() {
             this.value = "";
        }
    };
}


// Chunk of JS which attaches calendar to each input having type "date"
window.onload = function() {
    inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute("type") == "date") {
            attachCalendar(inputs[i].id);
        }
    }
}

