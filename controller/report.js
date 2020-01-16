const   Worker  =   require("../models/worker")
    ,   Disciple  =   require("../models/disciple")
    ,   Report  =   require("../models/report")
    , flash = require("connect-flash")
    ;



module.exports = {
    getReports: (req, res) => {
        console.log(req.user)
        let worker = {
            _id: req.user.id
        }
        
        Worker.findById(worker).
            populate({path: 'reports', populate: { path: 'disciples' }})
            // populate("disciples")
            .then((presentWorkers) => {
                let reports = presentWorkers.reports;
                console.log("reports of get REports///////////");
                console.log(presentWorkers);
                console.log(presentWorkers.username);
                console.log(reports.length);
                let dayWeek = [];
                let month = [];
                let arrDay = [[0, "Sunday"], [1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"]];
                let allDay = []
                reports.forEach((report) => {
                    let j = report.date.getDay();
                    let reportDay = arrDay[j];
                    let day = reportDay[1];
                    month.push(report.date.getMonth() + 1);
                    allDay.push(day);
                })
                res.render("report", { reports, dayWeek, month, allDay });
            })
            .catch((err) => {
                console.log(err);
            });
    },
    
    postNewReport: async (req, res) => {
        console.log("START////////////")
        let worker = {
            _id: req.user.id
        }
        
        let newReport = await Report.create(new Report)
        const ids = req.body.ids;
        
        try {
            const arr = [];
            
            let i = 0;
            while (!(arr.length === ids.length)) {
                let id = ids[i];
                console.log("finding");
                let foundDisciple = await Disciple.findById(id);
                newReport.disciples.push(foundDisciple);
                let yesSaved = await newReport.save();
                // yesSaved;
                console.log("////yesSaved////");
                console.log(yesSaved);
                if (yesSaved) {
                    arr.push("yesSaved");
                    console.log(arr);
                    i++; 
                }
            }
            // if (id) {
            console.log("Saved Report");
            let foundWorker = await Worker.findById(worker);
            foundWorker.reports.push(newReport);
            let savedWorker = await foundWorker.save();
            if (savedWorker) {
                console.log("Oya save it!!!");
                // I learnt AJAX is designed not to change URL. So, the redirect wont work since AJAX is being used
                // res.redirect("/report");
                res.json("Done");
            }
        } catch (error) {
            console.log(error)
            req.flash("error", "You must complete your profile first");
            res.redirect("/register");
        }
    },

    newReport: (req, res) => {
        let worker = {
            _id: req.user.id
        }
        Worker.findById(worker).populate("disciples")
            .then((thisWorker) => {
                let allDisciples = thisWorker.disciples
                res.render("report_new", { allDisciples });
            })
            .catch((err) => {
                console.log(err);
            });
    },

    editOneReport: (req, res) => {
        let thisReportId = req.params.id;
        let worker = {
            _id: req.user.id
        }
        //get all disciples
        Worker.findById(worker)
        .populate({ path: 'reports', populate: { path: 'disciples' } })
        .populate("disciples")
        .then((foundWorker) => {
            let allDisciples = foundWorker.disciples;
            let allReports = foundWorker.reports;
            console.log("allReports/////////");
            console.log(foundWorker);
            console.log(allReports.length);
            // Look for the position of this report in the allReports array
                // Map all ids into an array
                let idsAllReports = allReports.map((elem) => {
                    return elem._id;
                })
                // Look for position of thisReportId in that array
                let index = idsAllReports.indexOf(thisReportId);
            console.log(".//////////////")
            console.log(allDisciples);
            //stringify the disicples in array
            let remDisciples = allDisciples.map((disc) => {
                return disc;
            })
            console.log(remDisciples);

            //get ids of disciples in report
                Report.findById(thisReportId).populate("disciples")
                .then((thisReport) => {
                    let discReport = thisReport.disciples;
                    if (discReport && discReport.length !== 0) {
                        let idsDiscReport = discReport.map((disc) => {
                            return disc._id.toString();
                        })
                        //find the index of ids of disciples in allDisciples and remove each {forEach} for list of remaining disciples
                        let idsAllDisciples = allDisciples.map((disc) => {
                            return disc._id;
                        })
                        // if discReport[i]._id find in allDisciples
                        // Remove if it is found
                        console.log("remDisciples")
                        console.log(remDisciples);
                        idsDiscReport.forEach(async (disc) => {
                            let i = idsAllDisciples.indexOf(disc);
                            console.log(i);
                            remDisciples.splice(i, 1);
                            idsAllDisciples.splice(i, 1);
                        })
                        console.log(remDisciples);
                    }
                    
                    res.render("report_edit", { thisReport, remDisciples, thisReportId, index });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
        //make new variable for list of remaining disciples
        //display remaining disciples on the right
    },

    getOneReport: async (req, res) => {
        let thisReportId = req.params.id;
        // console.log(req.params);
        // console.log(req.params.data);
        let worker = {
            _id: req.user.id
        }
        console.log(thisReportId);
        try {
            let foundWorker = await Worker.findById(worker).populate({ path: 'reports', populate: { path: 'disciples' } });
            let thisReport = await Report.findById(thisReportId).populate("disciples")
            let allReports = foundWorker.reports;
            
            let idsAllReports = allReports.map((elem) => {
                return elem._id;
            })
            // Look for position of thisReportId in that array
            let index = idsAllReports.indexOf(thisReportId);
            res.render("report_one", { thisReport, thisReportId, index });            
        } catch (error) {
            console.log(err);
        }
    },

    deleteReport: (req, res) => {
        thisReportId = req.params.id;
        Report.findByIdAndRemove(thisReportId)
        .then((good) => {
            res.redirect("/report");
        })
        .catch((err) => {
            console.log(err);
        })
    },

    removeDisciple: (req, res) => {
        thisReportId = req.params.id;
        Report.findById(thisReportId)
            .then((good) => {
                // console.log(good);
                console.log("///req.body._id////")
                console.log(req.body._id)
                Disciple.findById(req.body._id)
                .then((found) => {
                    console.log("///found.name///");
                    console.log(found.name);
                })
                let allFoundDisciples = good.disciples;
                allFoundDisciples.forEach((elem, i) => {
                    console.log(elem);
                    if (elem === null) {
                        allFoundDisciples.splice(i, 1);
                    }
                })
                console.log("allFoundDisciples//////");
                console.log(allFoundDisciples);
                let idsAllFoundDisciples = allFoundDisciples.map((disc) => {
                    return disc._id;
                })
                let index = idsAllFoundDisciples.indexOf(req.body._id);
                idsAllFoundDisciples.splice(index, 1);
                allFoundDisciples.splice(index, 1);
                console.log(allFoundDisciples);
                good.save();
                res.json("removed");
            })
            .catch((err) => {
                console.log(err);
            })
    },

    addDisciple: (req, res) => {
        thisReportId = req.params.id;
        Report.findById(thisReportId)
            .then((good) => {
                good.disciples.push(req.body._id);
                good.save();
                res.json("added");
            })
            .catch((err) => {
                console.log(err);
            })
    },

    addNewDisciple: async (req, res) => {
        thisReportId = req.params.id;
        let worker = {
            _id : req.user.id
        }
        
        let newReport = await Report.create(new Report)
        try {
            newReport.disciples.push(req.body._id);
            console.log("////newReport////");
            console.log(newReport);
            newReport.save();
            res.json("added");
            Worker.findById(worker)
            .then((foundWorker) => {
                foundWorker.reports.push(newReport);
                foundWorker.save();
            })
            .catch((err) => {
                console.log(err);
            })
        } catch (error) {
            console.log(error)
        }
    } 
}

