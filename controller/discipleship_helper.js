const   Worker              =   require("../models/worker")
    ,   Disciple            =   require("../models/disciple")
    ,   Discipleship        =   require("../models/discipleship_model")
    ,   flash               =   require("connect-flash")
    ,   moment              =   require("moment")
    ,   duplicateCheck      =   require("../utils/duplicateCheck")
    ,   Sorter              =   require("../utils/sorter")
    ,   postReport          =   require("../utils/postReport")
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
                res.render("discipleship/discipleship", { reports, dayWeek, month, allDay, foundWorker });
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem");
            res.redirect("/home");
        }
    },
    
    postNewReport: async (req, res) => {
        try {
            postReport(req, res, Discipleship, "author", "reports");

        } catch (error) {
            console.log(error)
            req.flash("error", "You must complete your profile first");
            res.redirect("/register");
        }
    },

    newReport: (req, res) => {
        let worker = { _id: req.user.id };
        Worker.findById(worker).populate("disciples")
            .then((thisWorker) => {
                let allDisciples = thisWorker.disciples
                res.render("discipleship/discipleship_new", {allDisciples});
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
                let thisReport = await Discipleship.findById(thisReportId)
                  .populate("disciples")
                    let discReport = thisReport.disciples;
                    if (discReport && discReport.length > 0 && !discReport.includes(null)) {
                        console.log(discReport, discReport.length)
                      let idsDiscReport = discReport.map(disc => {
                        //   if(disc._id){
                              return disc._id.toString();
                        //   }
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
                    let subDisciples = new Sorter;
                    remDisciples.forEach((disciple) => {
                        subDisciples.create(disciple.type);
                        subDisciples[disciple.type].push(disciple); 
                    })
                    res.render("discipleship/discipleship_edit", { thisReport, subDisciples, thisReportId, index, foundWorker });
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
            let thisReport = await Discipleship.findById(thisReportId).populate("disciples")
            let allReports = foundWorker.reports;
            
            let idsAllReports = allReports.map((elem) => {
                return elem._id;
            })
            // Look for position of thisReportId in that array
            let index = idsAllReports.indexOf(thisReportId);
            res.render("discipleship/discipleship_one", { thisReport, thisReportId, index });            
        } catch (error) {
            console.log(err);
        }
    },

    deleteReport: (req, res) => {
        thisReportId = req.params.id;
        Discipleship.findByIdAndRemove({ _id: thisReportId })
        .then((good) => {
            req.flash("success", "Deleted successfully")
            res.redirect("/discipleship");
            res.json(good);
        })
        .catch((err) => {
            console.log(err);
        })
    },

    removeDisciple: async (req, res) => {
        try {
            thisReportId = req.params.id;
            let good = await Discipleship.findById(thisReportId)
            let found = Disciple.findById(req.body._id)
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
            await good.save();
            res.json("removed");
        } catch (e) {
            console.log(e)
            res.status(404).json("Not found")
        }
        
    },

    addDisciple: async (req, res) => {
        try {
            thisReportId = req.params.id;
            let good = await Discipleship.findById(thisReportId)
            good.disciples.push(req.body._id);
            await good.save();
            res.json("added");
        } catch (e) {
            console.log(e)
            res.status(404).json("Not found")
        }
    },

    putReport: async (req, res) => {
        try {
            thisReportId = req.params.id;
            let good = await Discipleship.findById(thisReportId)
            good.info = req.body.info;
            good.for = req.body.for;
            good.title = req.body.title;
            await good.save();
            res.redirect("/discipleship");
        } catch (e) {
            req.flash("error", "There was a problem")
            console.log(e)
        }
        
    }
}

