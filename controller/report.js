const   Worker  =   require("../models/worker")
    ,   Disciple  =   require("../models/disciple")
    ,   Report  =   require("../models/report")
    , flash = require("connect-flash")
    ;



module.exports = {
    getReports: async (req, res) => {
        try {
            let worker = {
              _id: req.user.id
            };
            let foundWorker = await Worker.findById(worker)
              .populate({ path: "reports", populate: { path: "disciples" } })
              // populate("disciples")
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
                })
                res.render("report/report", { reports, dayWeek, month, allDay, foundWorker });
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem");
            res.redirect("/report");
        }
    },
    
    postNewReport: async (req, res) => {
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
                let foundDisciple = await Disciple.findById(id);
                newReport.disciples.push(foundDisciple);
                let yesSaved = await newReport.save();
                // yesSaved;
                if (yesSaved) {
                    arr.push("yesSaved");
                    i++; 
                }
            }
            // if (id) {
            let foundWorker = await Worker.findById(worker);
            foundWorker.reports.push(newReport);
            let savedWorker = await foundWorker.save();
            if (savedWorker) {
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
                res.render("report/report_new", { allDisciples });
            })
            .catch((err) => {
                console.log(err);
            });
    },

    editOneReport: async (req, res) => {
        try {
            let thisReportId = req.params.id;
            let worker = {
              _id: req.user.id
            };
            //get all disciples
            let foundWorker = await Worker.findById(worker)
              .populate({ path: "reports", populate: { path: "disciples" } })
              .populate("disciples");
            //   .then(foundWorker => {
                let allDisciples = foundWorker.disciples;
                let allReports = foundWorker.reports;
                // Look for the position of this report in the allReports array
                // Map all ids into an array
                let idsAllReports = allReports.map(elem => {
                  return elem._id;
                });
                // Look for position of thisReportId in that array
                let index = idsAllReports.indexOf(thisReportId);
                //stringify the disicples in array
                let remDisciples = allDisciples.map(disc => {
                  return disc;
                });

                //get ids of disciples in report
                let thisReport = await Report.findById(thisReportId)
                  .populate("disciples")
                    let discReport = thisReport.disciples;
                    if (discReport && discReport.length !== 0) {
                      let idsDiscReport = discReport.map(disc => {
                        return disc._id.toString();
                      });
                      //find the index of ids of disciples in allDisciples and remove each {forEach} for list of remaining disciples
                      let idsAllDisciples = allDisciples.map(disc => {
                        return disc._id;
                      });
                      // if discReport[i]._id find in allDisciples
                      // Remove if it is found

                      idsDiscReport.forEach(async disc => {
                        let i = idsAllDisciples.indexOf(disc);
                        remDisciples.splice(i, 1);
                        idsAllDisciples.splice(i, 1);
                      });
                    }
                    res.render("report/report_edit", { thisReport, remDisciples, thisReportId, index, foundWorker });
        } catch (e) {
            console.log(e)
        }
        
        //make new variable for list of remaining disciples
        //display remaining disciples on the right
    },

    getOneReport: async (req, res) => {
        let thisReportId = req.params.id;
        let worker = {
            _id: req.user.id
        }
        try {
            let foundWorker = await Worker.findById(worker).populate({ path: 'reports', populate: { path: 'disciples' } });
            let thisReport = await Report.findById(thisReportId).populate("disciples")
            let allReports = foundWorker.reports;
            
            let idsAllReports = allReports.map((elem) => {
                return elem._id;
            })
            // Look for position of thisReportId in that array
            let index = idsAllReports.indexOf(thisReportId);
            res.render("report/report_one", { thisReport, thisReportId, index });            
        } catch (error) {
            console.log(err);
        }
    },

    deleteReport: (req, res) => {
        thisReportId = req.params.id;
        Report.findByIdAndRemove({ _id: thisReportId })
        .then((good) => {
            res.json(good);
        })
        .catch((err) => {
            console.log(err);
        })
    },

    removeDisciple: (req, res) => {
        thisReportId = req.params.id;
        Report.findById(thisReportId)
            .then((good) => {
                Disciple.findById(req.body._id)
                .then((found) => {
                })
                let allFoundDisciples = good.disciples;
                allFoundDisciples.forEach((elem, i) => {
                    if (elem === null) {
                        allFoundDisciples.splice(i, 1);
                    }
                })
                let idsAllFoundDisciples = allFoundDisciples.map((disc) => {
                    return disc._id;
                })
                let index = idsAllFoundDisciples.indexOf(req.body._id);
                idsAllFoundDisciples.splice(index, 1);
                allFoundDisciples.splice(index, 1);
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

