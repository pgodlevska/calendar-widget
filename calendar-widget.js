/* Constants, config chunks */

/* Chunk of JS to attach calendar to each input having type "date" */
window.onload = function() {
    inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute("type") == "date") {
            attachCalendar(inputs[i].id);
        }
    }
};

/* Chunk of JS to attach calendar to input with id="date_input"
window.onload = function() {
    attachCalendar("date_input");
};*/

var SETT = {
    // Week starts from: 0 - Sunday, 1 - Monday, .. 6 - Saturday.
    startWeek: 0,
    // Number of years in select before and after selected.
    yearsDelta: 20,
    maxYearsSelectLength: 300
};

var CONT = {
    arrowBack: "&#9668;",
    arrowForward: "&#9658;",
    monthNames: ["January", "February", "March", "April",
                  "May", "June", "July", "August",
                  "September", "October", "November", "December"
                 ],
    dayShortNames: ["S", "M", "T", "W", "T", "F", "S"]
};

var DOM_ID = {
    arrowBack: "arrow_back_",
    arrowForward: "arrow_forward_",
    monthInst: "month_name_",
    yearInst: "year_name_",
    monthBody: "month_body_",
    monthSelect: "month_select_",
    yearSelect: "year_select_"
};

var CSS_REF = {
    container: "cw-container",
    field: "cw-field",
    innerScroll: "cw-inner-scroll",
    sequelOuterScroll: " outer-scroll",
    monthHeader: "cw-month-head",
    arrowBack: "cw-arrow-back",
    arrowForward: "cw-arrow-forward",
    longWord: "cw-long-word",
    innerScroll: "cw-inner-scroll",
    sequelOuterScroll: " outer-scroll",
    day: "cw-day",
    sequelDayFirst: " first",
    sequelDayLast: " last",
    sequelDayOfWeek: " of-week",
    sequelDayNotMonth: " not-month",
    sequelDayRegular: " regular",
    sequelSelected: " selected"
};
/* Eof Constants, config chunks */


/* Preparing data functions */

function yearsRange(year, delta, both) {
    both = both || false;
    var range = new Array();
    if (both) {
        delta = Math.abs(delta);
        for (var i = year - delta; i < year + delta; i++) {
            range.push(i);
        }
    } else {
        if (delta > 0) {
            for (var i = year; i < year + delta; i++) {
                range.push(i);
            }
        } else if (delta < 0) {
            for (var i = year; i > year + delta; i--) {
                range.push(i);
            }
        }
    }
    return range;
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
    var j;
    // All weeks contain this month days
    while (d < firstOfNextMonth) {
        // Arrange days in weeks
        daysInWeeks[i] = new Array();
        for (j = 0; j < 7; j++) {
            daysInWeeks[i][j] = d.getDate();
            d.setDate(d.getDate() + 1);
        }
        i++;
   }
   return daysInWeeks;
}
/* Eof Preparing data functions */


/* Elements elementary functions */

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

function toggle(element) {
    if (element.style.display == "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}
/* Eof Elements elementary functions */


/* Scrollable select render functions */

function renderScrollSelect(data, dateSource) {
    var scrollField = document.createElement("div");
    scrollField.className = CSS_REF.innerScroll;
    var item;

    for (var i = 0; i < data.length; i++) {
        item = setNode(scrollField, CSS_REF.longWord, data[i]);
        if (parseInt(data[i])) {
            item.value = data[i];
            if (data[i] === dateSource.getFullYear()) {
                item.className += CSS_REF.sequelSelected;
            }
        } else {
            item.value = i;
            if (i == dateSource.getMonth()) {
                item.className += CSS_REF.sequelSelected;
            }
        }
    }
    return scrollField;
}

function closeSelectInPos(selectBody) {
    if (selectBody.parentNode.style.display == "none") {
        selectBody.parentNode.style.display = "block";
    }
    var items = selectBody.childNodes;
    for (var i = 0; i < items.length; i++) {
        if (items[i].className.indexOf(CSS_REF.sequelSelected) != -1) {
            break;
        }
    }
    if (i > 1) {
       selectBody.scrollTop = (i - 1) * items[0].offsetHeight;
    } else {
       selectBody.scrollTop = 0;
    }
    selectBody.parentNode.style.display = "none";
}

function extendYearsSelect(selectBody) {
    // appendTo - string defines add years to start or to end of select
    // values: "start" and "end" respectively
    if (selectBody.scrollTop > 1 && selectBody.scrollTop < 10) {
        var start = true;
    } else if (selectBody.scrollTop == selectBody.scrollTopMax) {
        var start = false;
    } else {
        return false;
    }
    var selectItems = selectBody.childNodes;
    var selectLength = selectItems.length;
    if (selectLength >= SETT.maxYearsSelectLength) {
        return false;
    }
    var item;
    if (start) {
        var year = parseInt(selectItems[0].innerHTML);
        var delta = -SETT.yearsDelta;
    } else {
        var year = parseInt(selectItems[selectLength-1].innerHTML);
        var delta = SETT.yearsDelta;
    }
    var years = yearsRange(year, delta);
    for (var i = 1; i < years.length; i++) {
        item = document.createElement("div");
        item.className = CSS_REF.longWord;
        item.innerHTML = years[i];
        item.value = years[i];
        if (start) {
            selectBody.insertBefore(item, selectBody.firstChild);
        } else {
            selectBody.appendChild(item);
        }
    }
    if (start) {
        selectBody.scrollTop = (SETT.yearsDelta - 1) * item.offsetHeight;
    }
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
    closeSelectInPos(scrollField);
    return scrollBody;
}
/* Eof Scrollable select render functions */


/* Month display functions */

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

function renderMonth(dateSource) {
    // Render numeric part of month display
    var today = new Date();
    var days = monthInWeeks(dateSource, SETT.startWeek);
    var monthDays = document.createElement("div");

    var i;
    var j;
    var week;
    for (i = 0; i < days.length; i++) {
        week = setNode(monthDays);
        fillWeek(week, days[i]);
        dayNodes = week.childNodes;
        for (j = 0; j < dayNodes.length; j++) {
            dayNo = parseInt(dayNodes[j].innerHTML);

            // Find days not from rendered month
            if (i < 1 && dayNo > 7 ||
                i > 1 && dayNo < 7) {
                dayNodes[j].className += CSS_REF.sequelDayNotMonth;
            } else {
                dayNodes[j].className += CSS_REF.sequelDayRegular;

                // Find and highlight today
                if (dateSource.getFullYear() == today.getFullYear() &&
                        dateSource.getMonth() == today.getMonth() &&
                        dayNo == today.getDate()) {
                    dayNodes[j].className += CSS_REF.sequelSelected;
                }
            }
        }
    }
    return monthDays;
}
/* Eof Month display functions */


/* Create calendar functions */
function createCalendar(container, dateSource, idSuffix){

    // Create calendar in given div "container"
    container.className = CSS_REF.container;
    var field = setNode(container, CSS_REF.field);

    // Month Header
    var monthHeader = setNode(field, CSS_REF.monthHeader);
    var arrowBack = setNode(monthHeader,
                            CSS_REF.arrowBack,
                            CONT.arrowBack,
                            DOM_ID.arrowBack + idSuffix);
    var monthInst = setNode(monthHeader,
                            CSS_REF.longWord + CSS_REF.sequelSelected,
                            CONT.monthNames[dateSource.getMonth()],
                            DOM_ID.monthInst + idSuffix);
    var yearInst = setNode(monthHeader,
                           CSS_REF.longWord + CSS_REF.sequelSelected,
                           dateSource.getFullYear(),
                           DOM_ID.yearInst + idSuffix);
    var arrowForward = setNode(monthHeader,
                               CSS_REF.arrowForward,
                               CONT.arrowForward,
                               DOM_ID.arrowForward + idSuffix);

    // Select month
    layoutScrollSelect(DOM_ID.monthSelect + idSuffix,
                       monthInst,
                       CONT.monthNames,
                       dateSource);

    // Select year
    var yearsData = yearsRange(dateSource.getFullYear(),
                               SETT.yearsDelta,
                               true);
    var yearSelect = layoutScrollSelect(DOM_ID.yearSelect + idSuffix,
                                        yearInst,
                                        yearsData,
                                        dateSource);
    yearSelect.firstChild.onscroll = function() {
        extendYearsSelect(this);
    };

    // Month
    var monthBody = setNode(field, "", "", DOM_ID.monthBody + idSuffix);
    // Header with week days
    var weekHead = setNode(monthBody);
    fillWeek(weekHead, CONT.dayShortNames, true);
    // Month days
    var monthDays = renderMonth(dateSource);
    monthBody.appendChild(monthDays);
}
/* Eof Create calendar functions */


/* Switch month functions */
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
    closeSelectInPos(months);

    // Set years select
    var yearSelect = getCwElement(DOM_ID.yearSelect, suffix);
    var yearsData = yearsRange(dateSource.getFullYear(),
                               SETT.yearsDelta,
                               true);
    var years = renderScrollSelect(yearsData, dateSource);
    yearSelect.replaceChild(years, yearSelect.lastChild);
    years.onscroll = function() {
         extendYearsSelect(this);
    };
    closeSelectInPos(years);

    // Set month days
    var monthBody = getCwElement(DOM_ID.monthBody, suffix);
    var monthDays = renderMonth(dateSource);
    monthBody.replaceChild(monthDays, monthBody.lastChild);
}
/* Eof Switch month functions */


function attachCalendar(dateInputId) {
    var dateInput = document.getElementById(dateInputId);
    // Test element to attach calendar
    if (dateInput.getAttribute("type") != "date" &&
            dateInput.getAttribute("type") != "text") {
        return;
    }

    // Create and place container for calendar
    var container = document.createElement("div");
    dateInput.parentNode.insertBefore(container, dateInput.nextSibling);
    var xOffset = dateInput.getBoundingClientRect().left;
    container.style.left = xOffset;

    // Set the current date - from value or today
    var currentDate;
    if (dateInput.value && dateFromString(dateInput.value)) {
        currentDate = dateFromString(dateInput.value);
    } else {
        currentDate = new Date();
    }

    // Input focus handler
    dateInput.onfocus = function() {
        // Create calendar if container is empty
        if (!container.hasChildNodes()) {
            createCalendar(container, currentDate, dateInputId);

            // Set calendar events handlers
            // Month back
            var monthBack = getCwElement(DOM_ID.arrowBack, dateInputId);
            monthBack.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() - 1);
                switchMonth(currentDate, dateInputId);
            };

            // Month forward
            var monthForward = getCwElement(DOM_ID.arrowForward, dateInputId);
            monthForward.onclick = function() {
                currentDate.setMonth(currentDate.getMonth() + 1);
                switchMonth(currentDate, dateInputId);
            };

            var monthInst = getCwElement(DOM_ID.monthInst, dateInputId);
            var monthSelect = getCwElement(DOM_ID.monthSelect, dateInputId);
            var yearInst = getCwElement(DOM_ID.yearInst, dateInputId);
            var yearSelect = getCwElement(DOM_ID.yearSelect, dateInputId);

            // Month select
            monthInst.onclick = function() {
                if (yearSelect.style.display == "block") {
                    closeSelectInPos(yearSelect.firstChild);
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

            // Year select
            yearInst.onclick = function() {
                if (monthSelect.style.display == "block") {
                    closeSelectInPos(monthSelect.firstChild);
                }
                yearSelect.style.display = "block";
            };
            yearSelect.onclick = function(e) {
                var year = e.target;
                if (year.value) {
                    currentDate.setFullYear(year.value);
                    switchMonth(currentDate, dateInputId);
                }
            };

            // Pick a date
            var monthBody = getCwElement(DOM_ID.monthBody, dateInputId);
            monthBody.onclick = function(e) {
                var day = e.target;
                var dayClass = day.className;
                if (dayClass.indexOf(CSS_REF.sequelDayRegular) != -1) {
                    currentDate.setDate(day.innerHTML);
                    dateInput.value = dateString(currentDate);
                    closeSelectInPos(monthSelect.firstChild);
                    closeSelectInPos(yearSelect.firstChild);
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
                        closeSelectInPos(monthSelect.firstChild);
                    } else if (yearSelect.style.display == "block") {
                        closeSelectInPos(yearSelect.firstChild);
                    } else if (container.style.display == "block") {
                        container.style.display = "none";
                    }
                }
            };
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

