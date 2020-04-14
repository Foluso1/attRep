const       Worker     =       require("../models/worker")
            , lastMondayfunction = require("../utils/lastMonday")
            , refWeekFromMonfunction = require("../utils/refWeekFromMon")
            , findThisWeekNumber = require("../utils/findThisWeekNumber")
            , dMDYYYY                   =   require("../utils/dMDYYYY")
            ,   moment  =   require("moment")
            ;


module.exports = {
    getWorkers: (req, res) => {
        let currentWorker = req.user.id;
        Worker.findById(currentWorker).populate("workers")
        .then((foundWorker) => {
            let subWorkers = foundWorker.workers
            subWorkers.forEach((foundworker) => {
                foundworker.password = undefined;
            })
            res.render("lma/lma", { subWorkers });
        })
        .catch((err) => {
            console.log(err);
        })
    },

    postWorker: (req, res) => {
        let currentWorker = req.user.id;
        let input = { _id: req.body._id };
        Worker.findById(input)
        .then((foundWorker) => {
            Worker.findById(currentWorker)
            .then((lma) => {
                lma.workers.push(foundWorker);
                lma.save();
                res.status(201).end();
            })
            .catch((err) => {
                console.log(err);
            })
        })
    },

    addRemoveOrDelWorker: (req, res) => {
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
                                // if (worker.length >= 0) {
                                    let index = arrWorkersId.indexOf(worker._id.toString());
                                    if (index != -1) {
                                        arrWorkersId.splice(index, 1);
                                    // }
                                }
                            }
                        }
                        arrWorkersId.splice(arrWorkersId.indexOf(currentWorker.toString()), 1); //remove currentworker from array
                        arrWorkersId.forEach((workerId) => {
                            addWorker.push(arrWorkers[arrWorkersIdTwo.indexOf(workerId)]);
                        })
                        res.render("lma/lmaNew", { addWorker, workerCheck });
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
        let currentWorker = req.user.id;
        Worker.findById(currentWorker)
            .then((foundWorker) => {
                let arr = foundWorker.workers;
                let index = arr.indexOf(req.body._id);
                if (index == -1){
                    res.json("not removed")
                } else {
                    arr.splice(index, 1);
                    foundWorker.save();
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

    getPrayerReport: async (req, res) => {
        lmaUser = req.user.id;
        idCurrentWorker = req.params.id;

        let week = 604800000; // Number of milliseconds in a week;
        try {
            let foundWorker = await Worker.findById({ _id: idCurrentWorker }).populate("prayerReport")

            // let b = new Date(sixDaysAfter(lastSundayfunction(Date.now())));
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

            res.render("prayer/prayer", { weekNumPrDb, foundWorker });
        } catch (err) {
            console.log(err);
        }
    },

    getAllPrayerReports: async (req, res) => {
        try {
            let lmaWorkerId = { _id: req.user.id }
            let foundWorker = await Worker.findById(lmaWorkerId).populate("workers");
            let workersUnder = foundWorker.workers;
            let allWorkers = [];
            let dataL = 0;

            for(let i = 0; i < workersUnder.length; i++) {
                let workerId = { _id: workersUnder[i]._id }
                let thisWorker = await Worker.findById(workerId).populate("prayerReport");
                let prayerReport = thisWorker.prayerReport;
                let data = [`${thisWorker.firstname}, ${thisWorker.surname}`]
                for(let j = 0; j < prayerReport.length; j++) {
                    if (prayerReport[j].datePrayed.getFullYear() === new Date().getFullYear()){
                        data.push(`${dMDYYYY.dMDYYYY(prayerReport[j].datePrayed)}, (${refWeekFromMonfunction.refWeekFromMonfunction(prayerReport[j].datePrayed)}), (Week ${findThisWeekNumber.findThisWeekNumber(prayerReport[j].datePrayed)})`)
                    }
                }
                if (dataL < data.length) {
                    dataL = data.length - 1;
                }
                allWorkers.push(data);
            }
            res.render("lma/prayerAll", { allWorkers, dataL })
        } catch (err) {
            console.log(err);
        }
    },

    deleteWorker: async (req, res) => {
        try {
            let id = req.params.id
            let toDelWorker = await Worker.findOneAndRemove({ _id: id });
            res.json(toDelWorker);
        } catch (err) {
            console.log(err);
        }
    },

    getDiscipleshipReport: async (req, res) => {
        try {
              let worker = {
                _id: req.params.id
              };
              let foundWorker = await Worker.findById(worker)
                .populate({ path: "reports", populate: { path: "disciples" } })
                  let reports = foundWorker.reports;
                  let dayWeek = [];
                  let month = [];
                  let arrDay = [ [0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"] ];
                let allDay = [];
                reports.forEach(report => {
                    let j = report.date.getDay();
                    let reportDay = arrDay[j];
                    let day = reportDay[1];
                    month.push(report.date.getMonth() + 1);
                    allDay.push(day);
                });
                res.render("report", { reports, dayWeek, month, allDay, foundWorker });
            } catch (e) {
            console.log(e);
            req.flash("Error", "There was a problem")
            res.redirect("/lma");
        }
        
    },

    getPrayerChainReport: async (req, res) => {
        try {
            let ownerId = req.params.id;
            let currentWorker = req.user.id;
            let ownerStatus;// = ownerId == currentWorker;

            console.log(req.baseUrl, req.originalUrl);

            let thisWeekNum = moment().week() - 1;
            let allDayPrayed = [];
            let foundWorker = await Worker.findById({ _id: ownerId }).populate({path: "prayerChainReport"});
            let prChRepAll = foundWorker.prayerChainReport;
            prChRepAll.forEach((oneItem) => {
                if (thisWeekNum == moment(oneItem.date).week()) {
                    let dayPrayed = moment(oneItem.date).format("dddd");
                    let startTime = moment(oneItem.start).format("h:mm a");
                    let endTime = moment(oneItem.end).format("h:mm a");
                    let dayData = [dayPrayed, startTime, endTime];
                    allDayPrayed.push(dayData)
                }
            })
            res.render("prayerChain/prayerChain", { thisWeekNum, allDayPrayed, foundWorker });
        } catch (err) {
            console.log(err);
            req.flash("Error", "There was a problem");
            res.redirect("/lma");
        }
    },

    getAllLockdown: async (req, res) => {
        try {
            let lmaWorkerId = { _id: req.user.id };
            let baseUrl = req.baseUrl
            console.log("baseUrl", baseUrl)
            let dateForData = req.params.date;
            console.log("dateForData", dateForData)
            let foundWorker = await Worker.findById(lmaWorkerId).populate("workers");
            let workersUnder = foundWorker.workers;
            let startOfToday = 0;
            if (!dateForData) {
                startOfToday = moment().startOf('day')._d.getTime();
            } else {
                startOfToday = moment(dateForData).startOf("day")._d.getTime();
            }
            let manyArr = [];
            let noReportYet = [];
            for(let i = 0; i < workersUnder.length; i++) {
                // console.log(workersUnder[i])
                if (workersUnder.length > 0 && workersUnder[i].lockdown.length > 0){
                    let isReportToday = false;
                    let thisWorker = await Worker.findById({ _id: workersUnder[i].id }).populate("lockdown");
                    if (thisWorker.lockdown.length > 0) {
                        let lockdownArr = thisWorker.lockdown;
                        lockdownArr.filter( (item) => {
                            let thisDay = moment(item.dateOfReport).startOf("day")._d.getTime();
                            if (startOfToday == thisDay) {
                                isReportToday = true;
                                let abc = { 
                                    dateOfReport: moment().format("dddd, MMMM Do YYYY"),
                                    date: item.date,
                                    id: thisWorker.id,
                                    firstname: thisWorker.firstname,
                                    surname: thisWorker.surname,
                                    data: JSON.parse(item.data),
                                }
                                manyArr.push(abc)
                            } 
                        });
                        if (!isReportToday) {
                            let abc = {
                                id: thisWorker.id,
                                firstname: thisWorker.firstname,
                                surname: thisWorker.surname,
                            }
                            noReportYet.push(abc);
                        }
                    } else {
                        let abc = {
                            id: thisWorker.id,
                            firstname: thisWorker.firstname,
                            surname: thisWorker.surname,
                        }
                        noReportYet.push(abc);
                    }
                }
                // let thisWorkerLockdown = await Worker.findById({ _id: workersUnder[i]._id }).populate("lockdown")
            }
            res.render("lma/lmaLockdown", {manyArr, startOfToday, noReportYet, baseUrl});
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem");
            res.redirect("/lma");
        }
    },

    getAllLockdownWithDate: async (req, res) => {
        try {
            console.log(req.params);
            let baseUrl = req.baseUrl
            console.log("baseUrl", baseUrl)
            let dateForData = req.params.date;
            let lmaWorkerId = { _id: req.user.id };
            let foundWorker = await Worker.findById(lmaWorkerId).populate("workers");
            let workersUnder = foundWorker.workers;
            let startOfToday = moment(dateForData).startOf('day')._d.getTime();
            let manyArr = [];
            let noReportYet = [];
            for(let i = 0; i < workersUnder.length; i++) {
                // console.log(workersUnder[i])
                if(workersUnder.length > 0 && workersUnder[i].lockdown.length > 0){
                    let isReportToday = false;
                    let thisWorker = await Worker.findById({ _id: workersUnder[i].id }).populate("lockdown");
                    if (thisWorker.lockdown.length > 0) {
                        let lockdownArr = thisWorker.lockdown;
                        lockdownArr.filter( (item) => {
                            let thisDay = moment(item.dateOfReport).startOf("day")._d.getTime();
                            if (startOfToday == thisDay) {
                                isReportToday = true;
                                let abc = { 
                                    dateOfReport:   moment(dateForData).format("dddd, MMMM Do YYYY"),
                                    date: item.date,
                                    id: thisWorker.id,
                                    firstname: thisWorker.firstname,
                                    surname: thisWorker.surname,
                                    data: JSON.parse(item.data),
                                }
                                manyArr.push(abc)
                            } 
                        });
                        if(!isReportToday) {
                            let abc = {
                                id: thisWorker.id,
                                firstname: thisWorker.firstname,
                                surname: thisWorker.surname,
                            }
                            noReportYet.push(abc);
                        }
                    } else {
                        let abc = {
                            id: thisWorker.id,
                            firstname: thisWorker.firstname,
                            surname: thisWorker.surname,
                        }
                        noReportYet.push(abc);
                    }
                }
                // let thisWorkerLockdown = await Worker.findById({ _id: workersUnder[i]._id }).populate("lockdown")
            }
            res.render("lma/lmaLockdown", {manyArr, startOfToday, noReportYet, baseUrl});
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem");
            res.redirect("/lma");
        }
    },

    getOneLockdown: async (req, res) => {
        try {
            let workerId = req.params.id;
            let baseUrl = req.baseUrl
            console.log("baseUrl", baseUrl)
            let foundWorker = await Worker.findById({ _id: workerId }).populate("lockdown");
            let theseLockdownReports = foundWorker.lockdown;
            let lockdownReports = theseLockdownReports.map((item) => {
              return (thisOne = {
                dateOfReport: moment(item.dateOfReport).format('DD/MM/YYYY'), //Date choosen by user concerning the report
                data: JSON.parse(item.data),
              });
            });
            res.render("new/lockdown", { lockdownReports, baseUrl });
            
        } catch (e) {
            req.flash("error", "There was a problem");
            res.redirect("/lma");
            console.log(e);
        }

    },
}
 
// Find all worker under LMA
// Do a loop
// Don't forget to populate "Yes" / "datePrayed"
// Have an array for each worker [name, datePrayed (week1), datePrayed (week1), datePrayed (week1)]