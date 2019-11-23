const       express     =   require("express")
        ,   lmaRouter   =   express.Router()
        ,   Worker      =   require("../models/worker")
        ,   controller  =   require("../controller/lma")
        ,   middleware  =   require("../middleware")

;


lmaRouter.route("/")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getWorkers)
    .post(middleware.isLoggedIn, middleware.isLMA, controller.postWorker)
    .put(middleware.isLoggedIn, middleware.isLMA, controller.editWorker)
    .delete(middleware.isLoggedIn, middleware.isLMA, controller.removeWorker);

lmaRouter.route("/new")
.get(middleware.isLoggedIn, middleware.isLMA, controller.newWorker);

lmaRouter.get("/prayer/:id", (req, res) => {
    currentWorker = req.params.id;
    function lastSundayfunction(msDate) {
        let refSunday = 318600000; //Sun, 4th January 1970, 17:30:000;
        let week = 604800000; // Number of milliseconds in a week;
        let timeAYear = 31536000000; // Number of milliseconds in a year;
        let diffTime = msDate - refSunday;
        let diffWeek = diffTime / week; //Difference in number of weeks;
        let msLastSunday = refSunday + (week * Math.floor(diffWeek));
        return msLastSunday;
    };
    let week = 604800000; // Number of milliseconds in a week;
    Worker.findById({ _id: currentWorker })
        .populate("prayerReport")
        .then((foundWorker) => {
            // Defines six days added to beginning of the Week
            function sixDaysAfter(msDate) {
                let msSat = msDate + 541740000;
                return msSat;
            };

            function refWeekfunction(msDate) {
                let a = new Date(msDate);
                let weekMonth = a.getMonth();
                let weekDate = a.getDate();
                let weekYear = a.getFullYear();
                let b = new Date(sixDaysAfter(msDate));
                let plusWeekMonth = b.getMonth();
                let plusWeekYear = b.getFullYear();
                let plusWeekDate = b.getDate();
                let startWeek = `${weekDate}/${weekMonth + 1}/${weekYear} - ${plusWeekDate}/${plusWeekMonth + 1}/${plusWeekYear}`;
                return startWeek;
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

            //Defines Week Number
            function findWeekNumber(msDate) {
                let refYear2 = 1483228800000;// Jan 1, 2017
                let diffYear = msDate - refYear2;
                let fracWeek = diffYear / week;
                let times52 = fracWeek / 52;
                let abc = Math.floor(times52) - 1;
                let mult52 = abc * 52;
                let remWeek = fracWeek - mult52;
                let weekNum2 = Math.ceil(remWeek - 52);
                return weekNum2;
            }

            let refYear2 = 1483228800000;// Jan 1, 2017
            let diffYear = Date.now() - refYear2;
            let fracWeek = diffYear / week;
            let times52 = fracWeek / 52;
            let abc = Math.floor(times52) - 1;
            let mult52 = abc * 52;
            let remWeek = fracWeek - mult52;
            let weekNum2 = Math.ceil(remWeek - 52);

            let allWeekNum2 = [];
            let allWeekSpan = [];
            let allWeekPrayed = [];
            let allPrayed = [];
            let arrWeek = [];

            for (let i = weekNum2; i >= 1; i--) {
                let j = weekNum2 - i;
                allWeekNum2[i - 1] = i;
                let yearsTime = lastSundayfunction(Date.now()) - (j * week);
                refWeekfunction(yearsTime);
                allWeekSpan[i - 1] = refWeekfunction(yearsTime);
            };

            //Set default values 
            for (let i = weekNum2; i > 0; i--) {
                let msNxtSun = lastSundayfunction(Date.now() + week);
                let j = weekNum2 - i + 1;
                let k = j * week;
                allWeekPrayed[i] = refWeekfunction(msNxtSun - (k));
                arrWeek[i] = i;
                allPrayed[i] = false;
                allShortDate[i] = "Nil";
            }
            console.log(allWeekPrayed);

            //Give appropriate values from DB
            for (let i = prayerReports.length - 1; i >= 0; i--) {
                let datePrayed = prayerReports[i].datePrayed;
                let mslstSun = lastSundayfunction(datePrayed.getTime());
                let refWeek = refWeekfunction(mslstSun);
                let weekNum = findWeekNumber(mslstSun);
                allWeekPrayed[weekNum] = refWeek;
                allPrayed[weekNum] = prayerReports[i].prayed;
                allShortDate[weekNum] = dMDYYYY(datePrayed);
            };
            res.render("prayer", { allShortDate, arrWeek, allWeekPrayed, allPrayed, weekNum2 })
        })
        .catch((err) => {
            console.log(err);
        })
}),


lmaRouter.get("/report/:id", (req, res) => {
    console.log("Kofoworola");
    console.log(req.params);
    let worker = {
        _id: req.params.id
    }
    Worker.findById(worker).
        populate({ path: 'reports', populate: { path: 'disciples' } })
        .then((presentWorkers) => {
            let reports = presentWorkers.reports;
            let dayWeek = [];
            let month = [];
            let arrDay = [[0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"]];
            reports.forEach((report) => {
                let j = report.date.getDay();
                let reportDay = arrDay[j];
                month.push(report.date.getMonth() + 1);
            })
            res.render("report", { reports, dayWeek, month });
        })
        .catch((err) => {
            console.log(err);
        });
    // res.send("Good here!");
})

module.exports = lmaRouter;