const       Worker     =       require("../models/worker")
            , lastMondayfunction = require("../utils/lastMonday")
            , refWeekFromMonfunction = require("../utils/refWeekFromMon")
            , findThisWeekNumber = require("../utils/findThisWeekNumber")
            , dMDYYYY                   =   require("../utils/dMDYYYY")
            ;


// firstMondayOftheYear
// findThisWeekNumber
// lastMondayfunction
// refWeekFromMonfunction

// function lastMondayfunction(msDate) {
//     // let refSunday = 318600000; //Sun, 4th January 1970, 17:30:000;
//     let refMonday = 318600000 + (24 * 3600 * 1000) + (3 * 3600 * 1000) + (30 * 60 * 1000); //Mon, 5th January 1970, 9:00:000;
//     let week = 604800000; // Number of milliseconds in a week;
//     let timeAYear = 31536000000; // Number of milliseconds in a year;
//     let diffTime = msDate - refMonday;
//     let diffWeek = diffTime / week; //Difference in number of weeks;
//     let msLastMonday = refMonday + (week * Math.floor(diffWeek));
//     return msLastMonday;
// };

// function refWeekFromMonfunction(msDate) {
//     let lastMonday = lastMondayfunction(msDate)
//     let a = new Date(lastMonday);
//     let weekMonth = a.getMonth();
//     let weekDate = a.getDate();
//     let weekYear = a.getFullYear();
//     let b = new Date(sixDaysAfter(lastMonday));
//     let plusWeekMonth = b.getMonth();
//     let plusWeekYear = b.getFullYear();
//     let plusWeekDate = b.getDate();
//     console.log("plusWeekDate///////");
//     console.log(plusWeekDate);
//     let startWeek = `${weekDate}/${weekMonth + 1}/${weekYear} - ${plusWeekDate}/${plusWeekMonth + 1}/${plusWeekYear}`;
//     return startWeek;
// };

// function sixDaysAfter(msDate) {
//     let msSun = msDate + 541740000 - 12600000;
//     return msSun;
// };


// function dMDYYYY(fullDate) {
//     let month = fullDate.getMonth();
//     let day = fullDate.getDay();
//     let date = fullDate.getDate();
//     let year = fullDate.getFullYear();
//     let arrDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//     let arrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     let shortDate = `${arrDay[day]}, ${arrMonth[month]} ${date}, ${year}`;
//     return shortDate;
// };

module.exports = {
    getWorkers: (req, res) => {
        let currentWorker = req.user.id;
        Worker.findById(currentWorker).populate("workers")
        .then((foundWorker) => {
            let subWorkers = foundWorker.workers
            subWorkers.forEach((foundworker) => {
                foundworker.password = undefined;
                // console.log(foundworker.username);
            })
            // console.log(subWorkers)
            res.render("lma", { subWorkers });
            // console.log(foundWorkers);
        })
        .catch((err) => {
            console.log(err);
        })
    },

    postWorker: (req, res) => {
        let currentWorker = req.user.id;
        console.log("From Post Route");
        console.log(req.body);
        let input = { _id: req.body._id };
        // console.log(input);
        Worker.findById(input)
        .then((foundWorker) => {
            Worker.findById(currentWorker)
            .then((lma) => {
                lma.workers.push(foundWorker);
                lma.save();
                console.log("Saved!!");
                res.status(201).end();
            })
            .catch((err) => {
                console.log(err);
            })
        })
    },

    newWorker: (req, res) => {
        let currentWorker = req.user.id;
        let arrWorkers = [];
        let addWorker = [];
        Worker.findById({ _id: currentWorker })
            .populate("workers")
            .then((lma) => {
                Worker.find()
                    .populate("workers")
                    .then((workerList) => {
                        let workerCheck = lma.workers;
                        workerList.forEach((worker) => {
                                arrWorkers.push(worker);
                        })
                        let arrWorkersId = arrWorkers.map((foundOne) => {
                            return foundOne._id.toString();
                        });
                        let arrWorkersIdTwo = arrWorkers.map((foundOne) => {
                            return foundOne._id.toString();
                        }); //5-3-1; 5-3-1-1; 5-3-1-2; 5-3-1-3
                        if (workerCheck.length != 0) {
                            for(let i = 0; i < arrWorkers.length; i++) {
                                let j = Math.abs(workerCheck.length - 1 - i); 
                                if(j >= workerCheck.length){
                                    j = 0;
                                }
                                let worker = workerCheck[j];
                                console.log("j is " + j);
                                console.log("worker.length");
                                console.log(worker.length);
                                // if (worker.length >= 0) {
                                    console.log(worker);
                                    let index = arrWorkersId.indexOf(worker._id.toString());
                                    console.log("Index is " + index);
                                    if (index != -1) {
                                        arrWorkersId.splice(index, 1);
                                    // }
                                }
                            }
                        }
                        arrWorkersId.splice(arrWorkersId.indexOf(currentWorker.toString()), 1); //remove currentworker from array
                        console.log(arrWorkersId);
                        arrWorkersId.forEach((workerId) => {
                            addWorker.push(arrWorkers[arrWorkersIdTwo.indexOf(workerId)]);
                        })
                        console.log("addWorker tailend is ");
                        console.log(addWorker);
                        res.render("lmaNew", { addWorker, workerCheck });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            })
            .catch((err) => {
                console.log(err);
            })
    },

    editWorker: (req, res) => {
        console.log("the put route");
        console.log(req.body);
        let currentWorker = req.user.id;
        Worker.findById(currentWorker)
            .then((foundWorker) => {
                let arr = foundWorker.workers;
                console.log("Arr length is " + arr.length);
                // console.log(arr);
                let index = arr.indexOf(req.body._id);
                console.log(index);
                if (index == -1){
                    console.log("not saved!");
                    res.json("not removed")
                } else {
                    arr.splice(index, 1);
                    foundWorker.save();
                    console.log("Arr length is " + arr.length);
                    console.log("success");
                    res.json("removed");
                }
            })
            .catch((err) => {
                console.log(err);
            })
    },

    removeWorker: (req, res) => {
        let currentWorker = req.body;
        Worker.findById(currentWorker)
        .then((foundWorker) => {
            foundWorker.workers
        })
        .catch((err) => {
            console.log(err);
        })
    }, 

    getLma: async (req, res) => {
        lmaUser = req.user.id;
        idCurrentWorker = req.params.id;

        let week = 604800000; // Number of milliseconds in a week;
        try {
            let foundWorker = await Worker.findById({ _id: idCurrentWorker }).populate("prayerReport")
            let currentWorker = foundWorker;

            // let b = new Date(sixDaysAfter(lastSundayfunction(Date.now())));
            let prayerReports = foundWorker.prayerReport;


            // function firstMondayOftheYear() {
            //     let beginYear = new Date(new Date().getFullYear(), 0, 1); // January 1st of current year;
            //     let dayOftheWeek = beginYear.getDay()
            //     let firstMonday;
            //     if (dayOftheWeek !== 1) {
            //         //2
            //         let add = 7 - dayOftheWeek + 1;
            //         console.log(firstMonday)
            //         return firstMonday = (new Date(beginYear.getFullYear(), beginYear.getMonth(), (1 + add))).getTime();
            //     } else {
            //         return beginYear.getTime();
            //     }
            // }



            // function findThisWeekNumber(date) {
            //     //find lastMonday of date;
            //     //Get time of last Monday
            //     let lastMonday = lastMondayfunction(date);

            //     //let abc = Subtract time of first Monday of the Year from last Monday.
            //     let diffMondays = lastMonday - firstMondayOftheYear();

            //     //Divide abc by number of weeks and add 1 to it
            //     return Math.ceil((diffMondays / week) + 1);
            // }





            const weekNumPrDb = [];

            //Give appropriate values from DB
            for (let i = prayerReports.length - 1; i >= 0; i--) {
                let datePrayed = prayerReports[i].datePrayed;
                let mslastMon = lastMondayfunction.lastMondayfunction(datePrayed.getTime());
                console.log("mslastMon", mslastMon);
                console.log("datePrayed/////");
                console.log(datePrayed);
                let refWeek = refWeekFromMonfunction.refWeekFromMonfunction(mslastMon);

                // let mslstMon = lastMondayfunction(datePrayed.getTime());
                if (datePrayed.getFullYear() === new Date().getFullYear()) {
                    //Find weeek number of refWeeks in db
                    let weekNumAndDatePrayed = [findThisWeekNumber.findThisWeekNumber(mslastMon), datePrayed, refWeek];
                    console.log("weekNumAndDatePrayed", weekNumAndDatePrayed);
                    //Store in array
                    weekNumPrDb.push(weekNumAndDatePrayed);
                }
            };

            console.log("weekNumPrDb", weekNumPrDb)
            weekNumPrDb.forEach((elem) => {
                let j = elem[0];
                let jPrayed = elem[1];
                elem[1] = dMDYYYY.dMDYYYY(jPrayed);
            })

            res.render("lma/prayerLMA", { weekNumPrDb, currentWorker });
        } catch (err) {
            console.log(err);
        }
    }
}
 