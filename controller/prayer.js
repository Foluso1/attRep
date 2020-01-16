const Worker = require("../models/worker")
    , Prayer = require("../models/prayer")
    ;




function lastSundayfunction(msDate) {
    let refSunday = 318600000; //Sun, 4th January 1970, 17:30:000;
    let week = 604800000; // Number of milliseconds in a week;
    let timeAYear = 31536000000; // Number of milliseconds in a year;
    let diffTime = msDate - refSunday;
    let diffWeek = diffTime / week; //Difference in number of weeks;
    let msLastSunday = refSunday + (week * Math.floor(diffWeek));
    return msLastSunday;
};

function lastMondayfunction(msDate) {
    let refSunday = 318600000; //Sun, 4th January 1970, 17:30:000;
    let refMonday = 318600000 + (24 * 3600 * 1000) + (3 * 3600 * 1000) + (30 * 60 * 1000); //Mon, 5th January 1970, 9:00:000;
    let week = 604800000; // Number of milliseconds in a week;
    let timeAYear = 31536000000; // Number of milliseconds in a year;
    let diffTime = msDate - refMonday;
    let diffWeek = diffTime / week; //Difference in number of weeks;
    let msLastMonday = refSunday + (week * Math.floor(diffWeek));
    return msLastMonday;
};
module.exports = {
    postPrayerReport: (req, res) => {
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
        Prayer.create(data)
            .then((oneReport) => {
                console.log(oneReport);
                Worker.findById({ _id: currentWorker })
                    .then((foundWorker) => {
                        console.log("found worker is " + foundWorker);
                        foundWorker.prayerReport.push(oneReport);
                        foundWorker.save();
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log("err.name//////", err.name);
                    })
            })
            .catch((err) => {
                console.log(err);
            })
        // res.render("prayer", { dayer });
        res.redirect("/prayer");
    },

    getPrayerReports: (req, res) => {
        currentWorker = req.user.id;
        function lastSundayfunction(msDate) {
            // let refSunday = 318600000; //Sun, 4th January 1970, 17:30:000;
            // let refSunday = 318600000 + (24 * 3600 * 1000) + (3 * 3600 * 1000) + (30 * 60 * 1000); //Mon, 5th January 1970, 9:00:000;
            let refSunday = 417600000;
            let week = 604800000; // Number of milliseconds in a week;
            let timeAYear = 31536000000; // Number of milliseconds in a year;
            let diffTime = msDate - refSunday;
            let diffWeek = diffTime / week; //Difference in number of weeks;
            let msLastSunday = refSunday + (week * Math.floor(diffWeek));
            console.log("msLastMonday///////")
            console.log(new Date(msLastSunday));
            return msLastSunday;
        };
        let week = 604800000; // Number of milliseconds in a week;
        Worker.findById({ _id: currentWorker })
        .populate("prayerReport")
        .then((foundWorker) => {

            // Defines six days added to beginning of the Week
            function sixDaysAfter(msDate){
                let msSat = msDate + 541740000 - 12600000;
                return msSat;
            };

            function refWeekfunction(msDate){
                let a = new Date(msDate);
                let weekMonth = a.getMonth();
                let weekDate = a.getDate();
                let weekYear = a.getFullYear();
                let b = new Date(sixDaysAfter(msDate));
                let plusWeekMonth = b.getMonth();
                let plusWeekYear = b.getFullYear();
                let plusWeekDate = b.getDate();
                console.log("plusWeekDate///////");
                console.log(plusWeekDate);
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
            // let refYear2 = 1483228800000;// Jan 1, 2017
            // let diffYear = Date.now() - refYear2;
            // let fracWeek = diffYear / week;
            // let times52  = fracWeek / 52;
            // let abc = Math.floor(times52) - 1;
            // let mult52 = abc * 52;
            // let remWeek = fracWeek - mult52;
            let weekNum2 = findWeekNumber(); // Math.ceil(remWeek - 52);

            let allWeekNum2 = [];
            let allWeekSpan = [];
            let allWeekPrayed = [];
            let allPrayed = [];
            let arrWeek = [];

            // for(let i = weekNum2; i >= 1; i--){
            for(let i = findWeekNumber() + 1; i >= 1; i--){
                let j = findWeekNumber() - i - 1;
                console.log("findWeekNumber()//////////", findWeekNumber())
                allWeekNum2[i-1] = i;
                // let yearsTime = lastSundayfunction(Date.now()) - (j * week);
                // lastSundayfunction(weekNum2 * j)
                // refWeekfunction(yearsTime);
                allWeekSpan[i] = refWeekfunction(firstMondayOftheYear() - (week * j))
                console.log("///allWeekSpan///", allWeekSpan);
                // allWeekSpan[i - 1] = refWeekfunction(yearsTime);
            };
            allWeekPrayed = allWeekSpan;
            //Set default values 
            // for (let i = findWeekNumber() + 1; i > 0; i--){
            //     let msNxtSun = lastSundayfunction(Date.now() + week);
            //     let j = weekNum2 - i - 1;
            //     let k = j * week;
            //     allWeekPrayed[i] = refWeekfunction(msNxtSun - (k));
            //     allPrayed[i] = false;
            //     allShortDate[i] = "Nil";
            // }
            // console.log("allWeekPrayed///////", allWeekPrayed);
            const indexArr = [];

            //Give appropriate values from DB
            for (let i = prayerReports.length - 1; i >= 0; i--) {
                let datePrayed = prayerReports[i].datePrayed;
                let mslstSun = lastSundayfunction(datePrayed.getTime());
                console.log("datePrayed/////");
                console.log(datePrayed);
                arrWeek[i] = i;
                // let mslstMon = lastMondayfunction(datePrayed.getTime());
                if (datePrayed.getFullYear() === new Date().getFullYear()) {
                    let refWeek = refWeekfunction(mslstSun);
                    let weekNum = findWeekNumber(mslstSun) - 1;
                    indexArr.push(weekNum);
                    allWeekSpan[weekNum] = refWeek;
                    allPrayed[weekNum] = prayerReports[i].prayed;
                    allShortDate[weekNum] = dMDYYYY(datePrayed);
                }
            };

            console.log("allShortDate/////");
            console.log(allShortDate);
            
            let mapped = [];

            for(let i = 0; i < allShortDate.length; i++){
                if (i !== 2) {
                    mapped[i] = "Nil";
                } else {
                    mapped[i] = allShortDate[i];
                }
            }
            
            allShortDate = mapped;

            console.log("mapped/////");
            console.log(mapped);
            
            // console.log(remArr);
            // console.log("indexArr////", indexArr);

            console.log("allWeekPrayed/////");
            console.log(allWeekPrayed);
            
            res.render("prayer", { allShortDate, arrWeek, mapped, allWeekPrayed, allPrayed, weekNum2 });
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
