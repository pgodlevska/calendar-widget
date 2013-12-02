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
                        daySpans[j].className += CSS_REF.sequelSelected;
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
    var monthBody = document.getElementById(monthBodyId);
    var monthDays = renderMonth(dateSource);
    monthBody.replaceChild(monthDays, monthBody.lastChild);
}

function toggle(element) {
    if (element.style.display == "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}


/* CSS reference */
var CSS_REF = {
    container: "cw-container",
    field: "cw-field",
    innerScroll: "cw-inner-scroll",
    monthHeader: "cw-month-head",
    arrowBack: "cw-arrow-back",
    arrowForward: "cw-arrow-forward",
    longWord: "cw-long-word",
    day: "cw-day",
    sequelDayFirst: " first",
    sequelDayLast: " last",
    sequelDayOfWeek: " of-week",
    sequelDayNotMonth: " not-month",
    sequelDayRegular: " regular",
    sequelSelected: " selected",
    sequelOuterScroll: " outer-scroll"
};

/* Needed ID's */
DOM_ID ={
    arrowBack: "arrow_back_",
    arrowForward: "arrow_forward_",
    monthInst: "month_name_",
    yearInst: "year_name_",
    monthBody: "month_body_",
    monthSelect: "month_select_"
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
    var cssCompClass = CSS_REF.longWord + CSS_REF.sequelSelected;
    var monthInst = setNode("span", monthHeader, cssCompClass,
                            CONT.monthNames[dateSource.getMonth()],
                            monthInstId);
    var yearInstId = DOM_ID.yearInst + idSuffix;
    var yearInst = setNode("span", monthHeader, cssCompClass,
                           dateSource.getFullYear(), yearInstId);
    var arrowForwardId = DOM_ID.arrowForward + idSuffix;
    var arrowForward = setNode("span", monthHeader, CSS_REF.arrowForward,
                               CONT.arrowForward, arrowForwardId);

    // Select month
    var months = new Array();
    var monthSelectId = DOM_ID.monthSelect + idSuffix;
    var scrollBody = setNode("div", monthHeader, CSS_REF.field,
                             "", monthSelectId);
    scrollBody.className += CSS_REF.sequelOuterScroll;
    var monthField = setNode("div", scrollBody, CSS_REF.innerScroll);
    var xOffset = monthInst.getBoundingClientRect().right;
    xOffset -= monthInst.getBoundingClientRect().left;
    xOffset /= 2;
    scrollBody.style.left = xOffset;
    for (var i = 0; i < 12; i++) {
        months[i] = setNode("div", monthField, CSS_REF.longWord,
                            CONT.monthNames[i]);
        months[i].value = i;
        if (i == dateSource.getMonth()) {
            months[i].className += CSS_REF.sequelSelected;
            var scrollPos = i;
        }
    }
    var yOffset = -1 * months[0].offsetHeight;
    scrollBody.style.height = 9 * months[0].offsetHeight;
    monthField.scrollTop = scrollPos * months[0].offsetHeight;
    scrollBody.style.top = yOffset;
    scrollBody.style.display = "none";

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
    if (dateInput.getAttribute("type") != "date" &&
            dateInput.getAttribute("type") != "text") {
        return;
    }

    var container = document.createElement("div");
    var xOffset = dateInput.getBoundingClientRect().left;
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

            // Month select handler
            var monthInstId = DOM_ID.monthInst + dateInputId;
            var monthInst = document.getElementById(monthInstId);
            var monthSelectId = DOM_ID.monthSelect + dateInputId;
            var monthSelect = document.getElementById(monthSelectId);
            monthInst.onclick = function() {
                monthSelect.style.display = "block";
            };
            monthSelect.onclick = function(e) {
                var month = e.target;
                currentDate.setMonth(month.value);
                switchMonth(currentDate, dateInputId);
                monthSelect.style.display = "none";
            }

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
                    monthSelect.style.display = "none";
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
                    if (monthSelect.style.display == "block") {
                        monthSelect.style.display = "none";
                    } else if (container.style.display == "block") {
                        container.style.display = "none";
                    }
                }
            };
            //TODO: hanlders for month select and year select
            //TODO: put hadlers out of here
        }

        // Allow created calendar, disable user input
        container.style.display = "block";
        this.onkeydown = function(e) {
            var key = e.keyCode || e.charCode;
            // Clear input value on backspace and delete
            if (key == 8 || key == 46) {
                this.value = "";
            // Toggle on enter
            } else if (key ==13) {
                toggle(container);
            } else {
                return false;
            }
        };
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

