function yearsRange(year, delta) {
    var range = new Array();
    for (var i = year - delta; i < year + delta; ++i) {
         range.push(i);
    }
    return range;
}


function monthInWeeks(dateSource, startWeek) {
    // Day week starts: 0 - Sunday, 1 - Monday and so on till 6 - Saturday.
    startWeek = startWeek || 0;

    var daysInWeeks = new Array();
    // First day of month defined by given dateSource
    var d = new Date(dateSource.getFullYear(), dateSource.getMonth(), 1);
    var firstOfNextMonth = new Date(dateSource.getFullYear(),
                                    dateSource.getMonth() + 1, 1);
    // Look for latest start of the week before 1st of the month.
    if (d.getDay() != startWeek) {
        d.setDate(d.getDate() - d.getDay() + startWeek);
        }

    var i = 0;
    // All weeks contain this month days
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
    // Date format "yyyy-mm-dd"
    var dateString;
    dateString = dateSource.getFullYear().toString();
    dateString += "-";
    dateString += ("0" + (dateSource.getMonth() + 1).toString()).slice(-2);
    dateString += "-";
    dateString += ("0" + dateSource.getDate().toString()).slice(-2);
    return dateString;
}


function dateFromString(dateString) {
    // Date format "yyyy-mm-dd"
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


function getCwElement(idPrefix, idSuffix) {
    var elementId = idPrefix + idSuffix;
    return document.getElementById(elementId);
}


function setNode(nodeParent, nodeClass, nodeContent, nodeId) {
    var newNode = document.createElement("div");
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
        day = setNode(weekNode, CSS_REF.day, daysArray[i]);
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


function renderScrollSelect(data, dateSource) {
    var scrollField = document.createElement("div");
    scrollField.className = CSS_REF.innerScroll;
    var item;
    var scrollPos;
    for (var i = 0; i < data.length; i++) {
        item = setNode(scrollField, CSS_REF.longWord,
                         data[i]);
        if (parseInt(data[i])) {
            item.value = data[i]
            if (data[i] === dateSource.getFullYear()) {
                item.className += CSS_REF.sequelSelected;
                scrollPos = i;
            }
        } else {
            item.value = i;
            if (i == dateSource.getMonth()) {
                item.className += CSS_REF.sequelSelected;
                scrollPos = i;
            }
        }
    }
    return scrollField;
}


function setSelectToPos(selectBody, scrollUnit) {
    var items = selectBody.childNodes;
    for (var i = 0; i < items.length; i++) {
        if (items[i].className.indexOf(CSS_REF.sequelSelected) != -1) {
            break;
        }
    }
    if (selectBody.parentNode.style.display == "none") {
        selectBody.parentNode.style.display = "block";
    }
    if (i > 1) {
       selectBody.scrollTop = (i - 1) * scrollUnit;
    } else {
       selectBody.scrollTop = 0;
    }
    selectBody.parentNode.style.display = "none";
}


function layoutScrollSelect(idScroll, relatedInst, data, dateSource) {
    // Set scroll container and inner field
    var scrollBody = setNode(relatedInst.parentNode,
                             CSS_REF.field, "", idScroll);
    scrollBody.className += CSS_REF.sequelOuterScroll;
    var scrollField = renderScrollSelect(data, dateSource);
    scrollBody.appendChild(scrollField);
    // Calculate position
    var xOffset = -scrollBody.offsetWidth / 2;
    xOffset += relatedInst.offsetWidth / 2;
    xOffset += relatedInst.getBoundingClientRect().left;
    xOffset -= scrollBody.parentNode.getBoundingClientRect().left;
    yOffsetUnit = relatedInst.offsetHeight;
    // Place scrollable select
    scrollBody.style.left = xOffset;
    scrollBody.style.top = -1 * yOffsetUnit;
    scrollBody.style.height = 10 * yOffsetUnit;
    // Set scroll to selected item
    setSelectToPos(scrollField, yOffsetUnit);
    return scrollBody;
}


function renderMonth(dateSource) {
    var today = new Date();
    var days = monthInWeeks(dateSource, CONT.startWeek);
    var monthDays = document.createElement("div");

    for (var i = 0; i < days.length; i++) {
        week = setNode(monthDays);
        fillWeek(week, days[i]);
        daySpans = week.childNodes;
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
    // Set month name in header
    var monthInst = getCwElement(DOM_ID.monthInst, suffix);
    monthInst.innerHTML = CONT.monthNames[dateSource.getMonth()];
    // Set year in header
    var yearInst = getCwElement(DOM_ID.yearInst, suffix);
    yearInst.innerHTML = dateSource.getFullYear();
    // Set month select
    var monthSelect = getCwElement(DOM_ID.monthSelect, suffix);
    var months = renderScrollSelect(CONT.monthNames, dateSource);
    monthSelect.replaceChild(months, monthSelect.lastChild);
    setSelectToPos(months, monthInst.offsetHeight);
    // Set years select
    var yearSelect = getCwElement(DOM_ID.yearSelect, suffix);
    var yearsData = yearsRange(dateSource.getFullYear(), CONT.yearsDelta);
    var years = renderScrollSelect(yearsData, dateSource);
    yearSelect.replaceChild(years, yearSelect.lastChild);
    setSelectToPos(years, yearInst.offsetHeight);
    // Set month days
    var monthBody = getCwElement(DOM_ID.monthBody, suffix);
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
    monthSelect: "month_select_",
    yearSelect: "year_select_"
};

/* Content Constants */
var CONT = {
    // 0 - Sunday, 1 - Monday, .. 6 - Saturday
    startWeek: 0,
    arrowBack: "&#9668;",
    arrowForward: "&#9658;",
    monthNames: ["January", "February", "March", "April",
                  "May", "June", "July", "August",
                  "September", "October", "November", "December"
                 ],
    dayShortNames: ["S", "M", "T", "W", "T", "F", "S"],
    yearsDelta: 20
};


function createCalendar(container, dateSource, idSuffix){

    // Calendar layout
    container.className = CSS_REF.container;
    var field = setNode(container, CSS_REF.field);

    // Month Header
    var monthHeader = setNode(field, CSS_REF.monthHeader);
    var arrowBackId = DOM_ID.arrowBack + idSuffix;
    var arrowBack = setNode(monthHeader, CSS_REF.arrowBack,
                            CONT.arrowBack, arrowBackId);
    var monthInstId = DOM_ID.monthInst + idSuffix;
    var cssCompClass = CSS_REF.longWord + CSS_REF.sequelSelected;
    var monthInst = setNode(monthHeader, cssCompClass,
                            CONT.monthNames[dateSource.getMonth()],
                            monthInstId);
    var yearInstId = DOM_ID.yearInst + idSuffix;
    var yearInst = setNode(monthHeader, cssCompClass,
                           dateSource.getFullYear(), yearInstId);
    var arrowForwardId = DOM_ID.arrowForward + idSuffix;
    var arrowForward = setNode(monthHeader, CSS_REF.arrowForward,
                               CONT.arrowForward, arrowForwardId);

    // Select month
    var monthSelectId = DOM_ID.monthSelect + idSuffix;
    layoutScrollSelect(monthSelectId, monthInst,
                       CONT.monthNames, dateSource);

    // Select year
    var yearSelectId = DOM_ID.yearSelect + idSuffix;
    var yearsData = yearsRange(dateSource.getFullYear(), 20);
    layoutScrollSelect(yearSelectId, yearInst,
                       yearsData, dateSource);

    // Month
    var monthBodyId = DOM_ID.monthBody + idSuffix;
    var monthBody = setNode(field, "", "", monthBodyId);
    // Header with week days
    var weekHead = setNode(monthBody);
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
            var monthBack = getCwElement(DOM_ID.arrowBack, dateInputId);
            monthBack.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() - 1);
                switchMonth(currentDate, dateInputId);
            };

            // Month forward handler
            var monthForward = getCwElement(DOM_ID.arrowForward, dateInputId);
            monthForward.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() + 1);
                switchMonth(currentDate, dateInputId);
            };

            // Month select handler
            var monthInst = getCwElement(DOM_ID.monthInst, dateInputId);
            var monthSelect = getCwElement(DOM_ID.monthSelect, dateInputId);

            // Year select handler
            var yearInst = getCwElement(DOM_ID.yearInst, dateInputId);
            var yearSelect = getCwElement(DOM_ID.yearSelect, dateInputId);
            // Month select handler
            monthInst.onclick = function() {
                if (yearSelect.style.display == "block") {
                    yearSelect.style.display = "none";
                }
                monthSelect.style.display = "block";
            };
            monthSelect.onclick = function(e) {
                var month = e.target;
                if (month.value || month.value === 0) {
                    currentDate.setMonth(month.value);
                    switchMonth(currentDate, dateInputId);
                }
            }

            // Year select handler
            yearInst.onclick = function() {
                if (monthSelect.style.display == "block") {
                    monthSelect.style.display = "none";
                }
                yearSelect.style.display = "block";
            };
            yearSelect.onclick = function(e) {
                var year = e.target;
                if (year.value) {
                    currentDate.setFullYear(year.value);
                    switchMonth(currentDate, dateInputId);
                }
            }

            // Pick a date handler
            var monthBody = getCwElement(DOM_ID.monthBody, dateInputId);
            monthBody.onclick = function(e) {
                var day = e.target;
                var dayClass = day.className;
                if (dayClass.indexOf(CSS_REF.sequelDayRegular) != -1) {
                    currentDate.setDate(day.innerHTML);
                    var chosen = dateString(currentDate);
                    dateInput.value = chosen;
                    monthSelect.style.display = "none";
                    yearSelect.style.display = "none";
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
                    } else if (yearSelect.style.display == "block") {
                        yearSelect.style.display = "none";
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

