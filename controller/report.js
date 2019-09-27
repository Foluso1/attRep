const   Worker  =   require("../models/worker")
    ,   Report  =   require("../models/report")
                ;

module.exports = {
    getReports: (req, res) => {
        console.log(req.user)
        let worker = {
            _id: req.id
        }
        Worker.findById(worker).
            populate('reports')
            .then((presentWorkers) => {
                let reports = presentWorkers.reports;
                let dayWeek = [];
                reports.forEach((report) => {
                    let arrDay = [[1, "Monday"], [2, "Tuesday"], [3, "Wednesday"], [4, "Thursday"], [5, "Friday"], [6, "Saturday"], [7, "Sunday"]]
                    let j = report.date.getDay();
                    let reportDay = arrDay[j - 1];
                    dayWeek.push(reportDay[1]);
                })
                res.render("report", { reports, dayWeek });
            })
            .catch((err) => {
                console.log(err);
            });
    },
    
    postReport: (req, res) => {
        console.log("START////////////")
        let ids = req.body.ids;
        let worker = {
            _id: req.user.id
        }
        const delay = () => new Promise(rel => setTimeout(() => rel(), 2000));
        let cur = Promise.resolve()
        Report.create(new Report)
            .then((newReport) => {
                ids.forEach((id) => {
                    cur = cur.then(() => {
                        console.log("finding");
                        Disciple.findById(id)
                            .then((foundDisciple) => {
                                newReport.disciples.push(foundDisciple);
                                return delay().then(() => {
                                    console.log("saving");
                                    newReport.save().then((here) => console.log(here)).catch((err) => console.log(err));
                                    return delay().catch(err => console.error(err))
                                })
                                    .catch((err) => {
                                        console.log(err);
                                    })
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                Worker.findById(worker)
                    .then((foundWorker) => {
                        foundWorker.reports.push(newReport);
                        foundWorker.save();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        res.redirect("/report");
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

    getOneReport: (req, res) => {
        let id = req.params.id;
        console.log(req.params.id)
        Worker.findById({ _id: id })
            .then((foundWorker) => {
                // res.render("report");
                // res.redirect(`$`);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

