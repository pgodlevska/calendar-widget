function monthInWeeks(currDate, startWeek) {
    startWeek = startWeek || 0;
    startWeek %= 7;

    var daysInWeeks = new Array();
    var d = new Date(currDate.getYear(), currDate.getMonth(), 1);
    if (d.getDay() != startWeek) {
        d.setDate(d.getDate() - d.getDay() + startWeek);
        }
    var i = 0;
    while (d.getMonth() <= currDate.getMonth()) {
        daysInWeeks[i] = new Array();
        for (var j = 0; j < 7; j++) {
            daysInWeeks[i][j] = d.getDate();
            d.setDate(d.getDate() + 1)
        }
        i++;
   }
   return daysInWeeks;
}


function createCalendar(placeId){
                     var place = document.getElementById(placeId);
                     var container = document.createElement("div");
                     container.className = "cw-container";
                     place.appendChild(container);
                     var field = document.createElement("div");
                     field.className = "cw-field";
                     container.appendChild(field);
                     var monthHeader = document.createElement("div");
                     monthHeader.className += "cw-month-head";
                     field.appendChild(monthHeader);
                     var monthNames = ["January", "February", "March", "April",
                                       "May", "June", "July", "August",
                                       "September", "October", "November", "December"
                                      ];
                     var arrowBack = document.createElement("span");
                     arrowBack.className = "cw-arrow-back";
                     arrowBack.innerHTML = "&#9668;";
                     var monthInst = document.createElement("span");
                     var today = new Date();
                     monthInst.innerHTML = monthNames[today.getMonth()];
                     var yearInst = document.createElement("span");
                     yearInst.innerHTML = today.getFullYear();
                     var arrowForward = document.createElement("span");
                     arrowForward.className = "cw-arrow-forward";
                     arrowForward.innerHTML = "&#9658;";
                     monthHeader.appendChild(arrowBack);
                     monthHeader.appendChild(monthInst);
                     monthHeader.appendChild(yearInst);
                     monthHeader.appendChild(arrowForward);
                     var monthBody = document.createElement("div");
                     field.appendChild(monthBody);

                     var days = monthInWeeks(today);
                     var week;
                     var day;
                     dayNameShort = ["S", "M", "T", "W", "T", "F", "S"];

                     week = document.createElement("div");
                     monthBody.appendChild(week);
                     for (i = 0; i < 7; i++) {
                         day = document.createElement("span");
                         day.className = "cw-day of-week";
                         if (i == 0) {
                             day.className += " first";
                         } else if (i == 6) {
                             day.className += " last";
                         }
                         day.innerHTML = dayNameShort[i];
                         week.appendChild(day);
                     }
                     for (i = 0; i < days.length; i++) {
                         week = document.createElement("div");
                         monthBody.appendChild(week);
                         for (j = 0; j < 7; j++) {
                             day = document.createElement("span");
                             day.className += "cw-day";
                             if (j == 0) {
                                 day.className += " first";
                             } else if (j == 6){
                                 day.className += " last";
                             }
                             if (days[i][j] == today.getDate()) {
                                 day.className += " today";
                             }
                             if (i < 1 && days[i][j] > 7 || i > 1 && days[i][j] < 7) {
                                 day.className += " not-month";
                             }
                             day.innerHTML = days[i][j];
                             week.appendChild(day);
                         }
                     }

}
