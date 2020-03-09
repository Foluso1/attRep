const Worker = require("../models/worker")
    , Prayer = require("../models/prayer")
    , lastMondayfunction  = require("../utils/lastMonday")
    , refWeekFromMonfunction  = require("../utils/refWeekFromMon")
    , findThisWeekNumber  = require("../utils/findThisWeekNumber")
    , dMDYYYY = require("../utils/dMDYYYY")
    ;



module.exports = {
    postPrayerReport: async (req, res) => {
        let currentWorker = req.user.id;
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
            let refWeekDay = refWeekFromMonfunction.refWeekFromMonfunction(day.getTime());
            
            let foundWorker = await Worker.findById({ _id: currentWorker }).populate("prayerReport");
            let prayerReports = foundWorker.prayerReport;
            const arrPrayerReports = [];
            prayerReports.forEach((e) => {
                // Find refWeek of previous reports
                let elem = e.datePrayed;
                arrPrayerReports.push(refWeekFromMonfunction.refWeekFromMonfunction(elem.getTime()));
            });          

            // let abc = See if ref week of reported day tallies with refWeek of previous reports
            let ifFoundIndex = arrPrayerReports.indexOf(refWeekDay);
            if (ifFoundIndex === -1) {
                let createPrayer = await Prayer.create(data);
                foundWorker.prayerReport.push(createPrayer);
                foundWorker.save();
                req.flash("success", "You have successfully reported for the week!");
                res.redirect("/prayer");
            } else {
                // If abc is true alert (you have already prayed on that week);
                req.flash("error", "You have already reported for that week");
                res.redirect("/prayer");
            }
        } catch (error) {
            console.log(error);
        }
    },

    getPrayerReports: (req, res) => {
        currentWorker = req.user.id;
       
        let week = 604800000; // Number of milliseconds in a week;
        Worker.findById({ _id: currentWorker })
        .populate("prayerReport")
        .then((foundWorker) => {

            // let b = new Date(sixDaysAfter(lastSundayfunction(Date.now())));
            let allShortDate = [];
            let prayerReports = foundWorker.prayerReport;

            const weekNumPrDb = [];

            //Give appropriate values from DB
            for (let i = prayerReports.length - 1; i >= 0; i--) {
                let datePrayed = prayerReports[i].datePrayed;
                let mslastMon = lastMondayfunction.lastMondayfunction(datePrayed.getTime());
                let refWeek = refWeekFromMonfunction.refWeekFromMonfunction(mslastMon);

                // let mslstMon = lastMondayfunction(datePrayed.getTime());
                if (datePrayed.getFullYear() === new Date().getFullYear()) {
                    //Find weeek number of refWeeks in db
                    let weekNumAndDatePrayed = [findThisWeekNumber.findThisWeekNumber(mslastMon), datePrayed, refWeek];
                    //Store in array
                    weekNumPrDb.push(weekNumAndDatePrayed);
                }
            };
            weekNumPrDb.forEach((elem) => {
                let j = elem[0];
                let jPrayed = elem[1];
                elem[1] = dMDYYYY.dMDYYYY(jPrayed);
            })
            res.render("prayer/prayer", { weekNumPrDb });
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
            if (allDates && allDates.length === 0) {
                lastReport = 0;
            } else {
                lastReport = allDates[allDates.length - 1].date.getTime(); //Last reported time in database
            }
            let lastSunday = lastMondayfunction.lastMondayfunction(Date.now()) //refSunday + (week * Math.floor(diffWeek)); // 
            res.render("prayer/prayerNew", { lastReport, lastSunday });
        })
        .catch((err) => {
            console.log(err);
        })
    }

}

