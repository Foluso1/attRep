const Worker = require("../models/worker")
    , Prayer = require("../models/prayer")
    ;


function lastMondayfunction(msDate) {
    // let refSunday = 318600000; //Sun, 4th January 1970, 17:30:000;
    let refMonday = 318600000 + (24 * 3600 * 1000) + (3 * 3600 * 1000) + (30 * 60 * 1000); //Mon, 5th January 1970, 9:00:000;
    let week = 604800000; // Number of milliseconds in a week;
    let timeAYear = 31536000000; // Number of milliseconds in a year;
    let diffTime = msDate - refMonday;
    let diffWeek = diffTime / week; //Difference in number of weeks;
    let msLastMonday = refMonday + (week * Math.floor(diffWeek));
    return msLastMonday;
};

function refWeekFromMonfunction(msDate) {
    let lastMonday = lastMondayfunction(msDate)
    let a = new Date(lastMonday);
    let weekMonth = a.getMonth();
    let weekDate = a.getDate();
    let weekYear = a.getFullYear();
    let b = new Date(sixDaysAfter(lastMonday));
    let plusWeekMonth = b.getMonth();
    let plusWeekYear = b.getFullYear();
    let plusWeekDate = b.getDate();
    console.log("plusWeekDate///////");
    console.log(plusWeekDate);
    let startWeek = `${weekDate}/${weekMonth + 1}/${weekYear} - ${plusWeekDate}/${plusWeekMonth + 1}/${plusWeekYear}`;
    return startWeek;
};

function sixDaysAfter(msDate) {
    let msSun = msDate + 541740000 - 12600000;
    return msSun;
};

module.exports = {
    postPrayerReport: async (req, res) => {
        let currentWorker = req.user.id;
        console.log(req.body);
        let day = new Date(req.body.dayPrayed);
        let yesOrNo = false;
        if (req.body.dayPrayed) {
            yesOrNo = true;
        }
        let data = {
            datePrayed: day,
            prayed: yesOrNo
        };
        let dayer = day.toString();

        try {
            // Find ref week of reported day
            let refWeekDay = refWeekFromMonfunction(day.getTime());
            console.log("refWeekDay", refWeekDay);
            
            let foundWorker = await Worker.findById({ _id: currentWorker }).populate("prayerReport");
            let prayerReports = foundWorker.prayerReport;
            const arrPrayerReports = [];
            prayerReports.forEach((e) => {
                // Find refWeek of previous reports
                let elem = e.datePrayed;
                console.log("elem", elem);
                arrPrayerReports.push(refWeekFromMonfunction(elem.getTime()));
            });          
            console.log("arrPrayerReports", arrPrayerReports);

            // let abc = See if ref week of reported day tallies with refWeek of previous reports
            let ifFoundIndex = arrPrayerReports.indexOf(refWeekDay);
            if (ifFoundIndex === -1) {
                let createPrayer = await Prayer.create(data);
                foundWorker.prayerReport.push(createPrayer);
                foundWorker.save();
                res.redirect("/prayer");
            } else {
                req.flash("error", "You have already reported for that week");
                res.redirect("/prayer");
            }
            
            // If abc is true alert (you have already prayed on that week);


        } catch (error) {
            console.log(error);
        }
        // Prayer.create(data)
        //     .then((oneReport) => {
        //         console.log(oneReport);
        //         Worker.findById({ _id: currentWorker })
        //             .then((foundWorker) => {
        //                 console.log("found worker is " + foundWorker);
        //                 foundWorker.prayerReport.push(oneReport);
        //                 foundWorker.save();
        //             })
        //             .catch((err) => {
        //                 console.log(err);
        //                 console.log("err.name//////", err.name);
        //             })
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     })
        // // res.render("prayer", { dayer });
        // res.redirect("/prayer");
    },

    getPrayerReports: (req, res) => {
        currentWorker = req.user.id;
       
        let week = 604800000; // Number of milliseconds in a week;
        Worker.findById({ _id: currentWorker })
        .populate("prayerReport")
        .then((foundWorker) => {

            // Defines six days added to beginning of the Week
            function sixDaysAfter(msDate){
                let msSun = msDate + 541740000 - 12600000;
                return msSun;
            };


            function dMDYYYY(fullDate) {
                let month = fullDate.getMonth();
                let day = fullDate.getDay();
                let date = fullDate.getDate();
                let year = fullDate.getFullYear();
                let arrDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                let arrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let shortDate = `${arrDay[day]}, ${arrMonth[month]} ${date}, ${year}`;
                return shortDate;
            };

            // let b = new Date(sixDaysAfter(lastSundayfunction(Date.now())));
            let allShortDate = [];
            let prayerReports = foundWorker.prayerReport;


            function firstMondayOftheYear() {
                let beginYear = new Date(new Date().getFullYear(), 0, 1); // January 1st of current year;
                let dayOftheWeek = beginYear.getDay()
                let firstMonday;
                if (dayOftheWeek !== 1) {
                    //2
                    let add = 7 - dayOftheWeek + 1;
                    console.log(firstMonday)
                    return firstMonday = (new Date(beginYear.getFullYear(), beginYear.getMonth(), (1 + add))).getTime();
                } else {
                    return beginYear.getTime();
                }
            }


            //Defines Week Number
            function findWeekNumber(){
                let numWeeks = Math.ceil((Date.now() - firstMondayOftheYear()) / week);
                console.log("////from here////", firstMondayOftheYear());
                console.log(numWeeks);
                return numWeeks + 1;
            }

            function findThisWeekNumber(date) {
                //find lastMonday of date;
                //Get time of last Monday
                let lastMonday = lastMondayfunction(date);
                
                //let abc = Subtract time of first Monday of the Year from last Monday.
                let diffMondays = lastMonday - firstMondayOftheYear();
                
                //Divide abc by number of weeks and add 1 to it
                return Math.ceil((diffMondays / week) + 1);
            }
            
            let arrWeek = [];

            
         

            const weekNumPrDb = [];

            //Give appropriate values from DB
            for (let i = prayerReports.length - 1; i >= 0; i--) {
                let datePrayed = prayerReports[i].datePrayed;
                let mslastMon = lastMondayfunction(datePrayed.getTime());
                console.log("mslastMon", mslastMon);
                console.log("datePrayed/////");
                console.log(datePrayed);
                arrWeek[i] = i;
                let refWeek = refWeekFromMonfunction(mslastMon);

                // let mslstMon = lastMondayfunction(datePrayed.getTime());
                if (datePrayed.getFullYear() === new Date().getFullYear()) {
                    //Find weeek number of refWeeks in db
                    let weekNumAndDatePrayed = [findThisWeekNumber(mslastMon), datePrayed, refWeek];
                    console.log("weekNumAndDatePrayed", weekNumAndDatePrayed);
                    //Store in array
                    weekNumPrDb.push(weekNumAndDatePrayed);
                }
            };

            console.log("weekNumPrDb", weekNumPrDb)
            weekNumPrDb.forEach((elem) => {
                let j = elem[0];
                let jPrayed = elem[1];
                elem[1] = dMDYYYY(jPrayed);
            })
            console.log("allShortDate", allShortDate);
            
            res.render("prayer", { weekNumPrDb });
        })
        .catch((err) => {
            console.log(err);
        })
    },

    newPrayerReport: (req, res) => {
        let currentWorker = req.user.id;
        Worker.findById({ _id: currentWorker })
        .populate('prayerReport')
        .then((foundWorker) => {
            let allDates = foundWorker.prayerReport;
            let lastReport = 0;
            console.log(allDates);
            if (allDates && allDates.length === 0) {
                lastReport = 0;
            } else {
                lastReport = allDates[allDates.length - 1].date.getTime(); //Last reported time in database
            }
            let lastSunday = lastMondayfunction(Date.now()) //refSunday + (week * Math.floor(diffWeek)); // 
            res.render("prayerNew", { lastReport, lastSunday });
        })
        .catch((err) => {
            console.log(err);
        })
    }

}


// Find last report
// find refWeek of last report

// Find ref week of reported day
// Find refWeek of previous reports
// let abc = See if ref week of reported day tallies with refWeek of previous reports
// If abc is true alert (you have already prayed on that week);
