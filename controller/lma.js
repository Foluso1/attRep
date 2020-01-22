const       Worker     =       require("../models/worker")
            , lastMondayfunction = require("../utils/lastMonday")
            , refWeekFromMonfunction = require("../utils/refWeekFromMon")
            , findThisWeekNumber = require("../utils/findThisWeekNumber")
            , dMDYYYY                   =   require("../utils/dMDYYYY")
            ;


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
    },

    getAll: async (req, res) => {

        try {
            lmaWorkerId = {
                _id: req.user.id
            }
            let foundWorker = await Worker.findById(lmaWorkerId).populate("workers");
            let workersUnder = foundWorker.workers;
            let allWorkers = [];
            let dataL = 0;

            for(let i = 0; i < workersUnder.length; i++) {
                let workerId = {
                    _id: workersUnder[i]._id
                }
                console.log("workersUnder[i]", workersUnder[i]);
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
                console.log("data", data);
                allWorkers.push(data);
            }
            console.log("allWorkers", allWorkers);
            res.render("lma/prayerAll", { allWorkers, dataL })
        } catch (err) {
            console.log(err);
        }
        
    }
}
 
// Find all worker under LMA
// Do a loop
// Don't forget to populate "Yes" / "datePrayed"
// Have an array for each worker [name, datePrayed (week1), datePrayed (week1), datePrayed (week1)]