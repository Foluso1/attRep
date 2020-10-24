const         Worker                    = require("../models/worker")
            , Disciple                  = require("../models/disciple")
            , lastMondayfunction        = require("../utils/lastMonday")
            , refWeekFromMonfunction    = require("../utils/refWeekFromMon")
            , findThisWeekNumber        = require("../utils/findThisWeekNumber")
            , dMDYYYY                   = require("../utils/dMDYYYY")
            , moment                    = require("moment")
            , listAllReports            = require("../utils/listAllReports")
            ;


module.exports = {

    getAll: (req, res) => {
        res.render("lma/all/all");
    },

    getWorkers: (req, res) => {
        let currentWorker = req.user.id;
        Worker.findById(currentWorker).populate("workers")
        .then((foundWorker) => {
            let subWorkers = foundWorker.workers
            subWorkers.forEach((foundworker) => {
                foundworker.password = undefined;
            })
            subWorkers.sort((a, b) => {
                if (a.firstname.toUpperCase() < b.firstname.toUpperCase()) {
                    return -1;
                } else {
                    return 1;
                }
            });
            res.render("lma/lma", { subWorkers });
        })
        .catch((err) => {
            console.log(err);
        })
    },

    postWorker: async (req, res) => {
        try {
            let currentWorker = req.user.id;
            let input = { _id: req.body._id };
            let foundWorker = await Worker.findById(input)
            let lma = await Worker.findById(currentWorker)
            lma.workers.push(foundWorker);
            await lma.save();
            res.status(201).end();
        } catch (e) {
            console.log(e)
            res.status(404).json("There was a problem");
        }
        
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

    editWorker: async (req, res) => {
        try {
            let foundLMA = await Worker.findById({_id: req.user.id});

            if (Object.keys(req.body)[0] == "add"){
                foundLMA.workers.push(Object.values(req.body)[0]);
            } else if (Object.keys(req.body)[0] == "remove"){
                let index = foundLMA.workers.indexOf(Object.values(req.body)[0]);
                if (index == -1){
                    res.status(405).json('Not present')
                } else {
                    foundLMA.workers.splice(index, 1);
                }
            }
            await foundLMA.save();
            res.json("success")
            // res.status(403).json("forbidden");
        } catch (e) {
            console.log(e)
            res.status(403).json("Forbidden");
        }
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

    getAllDisciples: async (req, res) => {
        try {
            let foundDisciples = await Disciple.find().populate('discipler');
            let obj = {};
            foundDisciples.forEach((e) => {
                if(e.discipler){
                    obj[`${e.discipler.firstname.trim()} ${e.discipler.surname.trim()}`] = obj[`${e.discipler.firstname.trim()} ${e.discipler.surname.trim()}`] + `\n\t${e.name.trim()}`;
                } else {
                    obj['no discipler'] = obj['no discipler'] +`\n\t${e.name}`;
                }
            });
            res.render("lma/all/disciple_all", {obj});
        } catch (e) {
            console.log(e);
        }
    },

    getAllAttendanceWithDate: async (req, res) => {
        try {
            let dateForData = req.params.date;
            let lmaWorkerId = { _id: req.user.id };
            let foundWorker = await Worker.findById(lmaWorkerId).populate("workers");
            path = "attendance";
            let result = await listAllReports(dateForData, foundWorker, path)
            res.render("lma/all/attendanceAll", { result });
        } catch(e) {
            console.log(e)
            req.flash("error", "There was a problem");
            res.redirect("/")
        }
    },

    chooseDateAttendance: async (req, res) => {
        res.render("lma/all/choose_date_att");
    },
    
    chooseDateExpected: async (req, res) => {
        res.render("lma/all/choose_date_exp");
    },

    getAllExpectedAttendanceWithDate: async (req, res) => {
        try {
            let dateForData = req.params.date;
            let lmaWorkerId = { _id: req.user.id };
            let foundWorker = await Worker.findById(lmaWorkerId).populate("workers");
            path = "expected_attendance";
            let result = await listAllReports(dateForData, foundWorker, path)
            res.render("lma/all/expected_attendanceAll", { result });
        } catch(e) {
            console.log(e)
            req.flash("error", "There was a problem");
            res.redirect("/")
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

    getDisciples: async (req, res) => {
        try {
            let worker = {_id: req.params.id};
            let thisWorker = await Worker.findById(worker).populate('disciples');
            let disciples = thisWorker.disciples;
            let foundWorker = {
                _id: thisWorker._id,
                firstname: thisWorker.firstname,
                surname: thisWorker.surname
            }
            res.render("lma/discipleLMA", {disciples, foundWorker})
        } catch (e) {
            console.log(e)
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
                res.render("lma/discipleship", { reports, dayWeek, month, allDay, foundWorker });
            } catch (e) {
            console.log(e);
            req.flash("Error", "There was a problem")
            res.redirect("/lma");
        }
        
    },

    getEvangelismReport: async (req, res) => {
        try {
              let worker = {
                _id: req.params.id
              };
              let foundWorker = await Worker.findById(worker)
                .populate({ path: "evangelism", populate: { path: "disciples" } })
                  let evangelismR = foundWorker.evangelism;
                  let dayWeek = [];
                  let month = [];
                  let arrDay = [ [0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"] ];
                let allDay = [];

                let evangelism = evangelismR.map((item)=>{
                    return {
                        id: item._id, 
                        userId: foundWorker._id,
                        firstname: foundWorker.firstname,
                        surname: foundWorker.surname,
                        date: item.date, //Time of report creation
                        dateOnReport: moment(item.dateOnReport).format('DD/MM/YYYY'),  //Time stated on report by user
                        data: JSON.parse(item.data)
                    }
                });
                evangelism.sort((a, b) => {
                    return b.date - a.date; 
                });
                res.render("lma/evangelism", { evangelism, dayWeek, month, allDay, foundWorker });
        } catch (e) {
            console.log(e);
            req.flash("Error", "There was a problem")
            res.redirect("/lma");
        }
        
    },

    getAttendanceReport: async (req, res) => {
        try {
              let worker = {
                _id: req.params.id
              };
              let foundWorker = await Worker.findById(worker)
                .populate({ path: "attendance", populate: { path: "disciples" } })
                  let attendance = foundWorker.attendance;
                  let dayWeek = [];
                  let month = [];
                  let arrDay = [ [0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"] ];
                let allDay = [];
                attendance.forEach(report => {
                    let j = report.date.getDay();
                    let reportDay = arrDay[j];
                    let day = reportDay[1];
                    month.push(report.date.getMonth() + 1);
                    allDay.push(day);
                });
                res.render("lma/attendance", { attendance, dayWeek, month, allDay, foundWorker });
            } catch (e) {
            console.log(e);
            req.flash("Error", "There was a problem")
            res.redirect("/lma");
        }
    },

    getExpectedReport: async (req, res) => {
        try {
              let worker = {
                _id: req.params.id
              };
              let foundWorker = await Worker.findById(worker)
                .populate({ path: "expected_attendance", populate: { path: "disciples" } })
                  let expected_attendance = foundWorker.expected_attendance;
                  let dayWeek = [];
                  let month = [];
                  let arrDay = [ [0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"] ];
                let allDay = [];
                expected_attendance.forEach(report => {
                    let j = report.date.getDay();
                    let reportDay = arrDay[j];
                    let day = reportDay[1];
                    month.push(report.date.getMonth() + 1);
                    allDay.push(day);
                });
                res.render("lma/expected_attendance", { expected_attendance, dayWeek, month, allDay, foundWorker });
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

    getAllLockdownWithDate: async (req, res) => {
        try {
            let baseUrl = req.baseUrl
            let dateForData = req.params.date;
            let lmaWorkerId = { _id: req.user.id };
            let foundWorker = await Worker.findById(lmaWorkerId).populate("workers");
            let workersUnder = foundWorker.workers;
            let startOfToday = 0;
            if (!dateForData) {
                startOfToday = moment().startOf('day').valueOf();
            } else {
                startOfToday = moment(dateForData).startOf("day").valueOf();
            }
            let manyArr = [];
            let noReportYet = [];
            let noReportNames = "";
            for(let i = 0; i < workersUnder.length; i++) {
                if(workersUnder.length > 0 && workersUnder[i].lockdown.length > 0){
                    let isReportToday = false;
                    let thisWorker = await Worker.findById({ _id: workersUnder[i].id }).populate("lockdown");
                    if (thisWorker.lockdown.length > 0) {
                        let lockdownArr = thisWorker.lockdown;
                        lockdownArr.filter( (item) => {
                            let thisDay = moment(item.dateOfReport).startOf("day").valueOf();
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
                            noReportNames = noReportNames + `${thisWorker.firstname} ${thisWorker.surname} \n`;
                        }
                    } else {
                        let abc = {
                            id: thisWorker.id,
                            firstname: thisWorker.firstname,
                            surname: thisWorker.surname,
                        }
                        noReportYet.push(abc);
                        noReportNames = noReportNames + `${thisWorker.firstname} ${thisWorker.surname} \n`;
                    }
                } else if (workersUnder[i]) {
                    let thisWorker = await Worker.findById({ _id: workersUnder[i].id });
                    let abc = {
                        id: thisWorker.id,
                        firstname: thisWorker.firstname,
                        surname: thisWorker.surname,
                    }
                    noReportYet.push(abc);
                    noReportNames = noReportNames + `${thisWorker.firstname} ${thisWorker.surname} \n`;
                }
            }
            manyArr.sort((a, b) => {
                return b.date.getTime() - a.date.getTime();
            });
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
            let foundWorker = await Worker.findById({ _id: workerId }).populate({
                path: "lockdown",
                options: { sort: { date: -1 }}
            });
            let theseLockdownReports = foundWorker.lockdown;
            let workerDetails = {
                firstname: foundWorker.firstname,
                surname: foundWorker.surname,
            };
            let lockdownReports = theseLockdownReports.map((item) => {
              return (thisOne = {
                dateOfReport: moment(item.dateOfReport).format('DD/MM/YYYY'), //Date choosen by user concerning the report
                data: JSON.parse(item.data),
              });
            });
            
            res.render("new/lockdown", { lockdownReports, workerDetails, baseUrl });
            
        } catch (e) {
            req.flash("error", "There was a problem");
            res.redirect("/lma");
            console.log(e);
        }

    },

    getProfile: async (req, res) => {
        try {
            let foundWorker = await Worker.findById({ _id: req.params.id})
            let profile = {
                id: foundWorker._id,
                username: foundWorker.username,
                firstname: foundWorker.firstname,
                surname: foundWorker.surname,
                email: foundWorker.email,
                googleMail: foundWorker.googleMail,
                church: foundWorker.church,
                fellowship: foundWorker.fellowship,
                department: foundWorker.department,
                prayerGroup: foundWorker.prayerGroup,
                isLMA: foundWorker.isLMA,
            }
            res.render("lma/profileLMA", {profile});
        } catch (err) {
            console.log(err);
        }
    },

    postProfile: async (req, res) => {
        try {
            req.body;
            let profile = {
                isLMA: req.body.isLMA,
            }
            let foundWorker = await Worker.findOneAndUpdate({ _id: req.params.id }, profile, {new: true})
            res.redirect("/lma");
        } catch (err) {
            console.log(err);
        }
    },

    getAllWeeklyReports: async (req, res) => {
        try {
            let lmaUser = req.user._id;
            let workersUnder = await Worker.findById({ _id: lmaUser }).workers;
            for(let i = 0; i < workersUnder.length; i++) {
                thisWorkerReport = Worker.findworkersUnder[i].reports
            }
        } catch (e) {
            console.log(e)
        }
    },

    associateDisc: async (req, res) => {
        try {
            let discipleId = req.params.discId;
            let workerId = req.params.id;
            let foundDisciple = await Disciple.findById({_id: discipleId});    
            foundDisciple.discipler = workerId;
            await foundDisciple.save();
            res.json("Discipler associated!!");  
        } catch (e) {
            console.log(e)
        }
    },
}
 
// Find all worker under LMA
// Do a loop
// Don't forget to populate "Yes" / "datePrayed"
// Have an array for each worker [name, datePrayed (week1), datePrayed (week1), datePrayed (week1)]


