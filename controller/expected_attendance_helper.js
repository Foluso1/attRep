const   Worker              = require("../models/worker")
    ,   Disciple            = require("../models/disciple")
    ,   Expected            = require("../models/expected_attendance_model")
    ,   flash               = require("connect-flash")
    ,   moment              =   require("moment")
    ,   duplicateCheck      = require("../utils/duplicateCheck")
    ;
const JSONTransport = require("nodemailer/lib/json-transport");
    

module.exports = {
    getReports: async (req, res) => {
        try {
            let worker = { _id: req.user.id };
            let foundWorker = await Worker.findById(worker)
              .populate({ path: "expected_attendance", populate: {path: "disciples"} })
            //   .populate({ path: "disciples"})
              // populate("disciples")
                let expected_attendance = foundWorker.expected_attendance;
                res.render("expected_attendance/expected_attendance", { expected_attendance, foundWorker });
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem");
            res.redirect("/home");
        }
    },
    
    postNewReport: async (req, res) => {
        try {
            let worker = {_id: req.user.id}

            // console.log(req.body);

            let thisReport = {
                title: req.body.title,
                for: req.body.for,
                info: req.body.info,
                summoner: req.user.id,
            };
            console.log("thisReport", thisReport)
            let newReport = await Expected.create(thisReport)
            const ids = req.body.ids;
        
            const arr = [];
            
            let i = 0;
            if (ids) {
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
            }

            //Find last DB item
            let db_Worker =  await Worker.findById(worker).populate({ 
                path: "expected_attendance",
                options: {sort: {date: -1}, limit: 1},
                populate: {path: "disciples"} 
            });
            let lastDB_item = db_Worker.expected_attendance[0];
            let foundWorker = await Worker.findById(worker);

            let result = duplicateCheck(newReport, lastDB_item);

            if (result) {
                req.flash("error", "Duplicate report detected");
                res.json("ERROR, Duplicate Report")
            } else {
                req.flash("success", "Successfully Reported");
                foundWorker.expected_attendance.push(newReport);
                let savedWorker = await foundWorker.save();
                if (savedWorker) {
                    res.json("Done");
                }
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
                res.render("expected_attendance/expected_attendance_new", { allDisciples });
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
              .populate({ path: "expected_attendance"})
              .populate("disciples");
            //   .then(foundWorker => {
                let allDisciples = foundWorker.disciples;
                let allReports = foundWorker.expected_attendance;
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
                let thisReport = await Expected.findById(thisReportId)
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
                    res.render("expected_attendance/expected_attendance_edit", { thisReport, remDisciples, thisReportId, index, foundWorker });
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
            let foundWorker = await Worker.findById(worker).populate({ path: 'expected_attendance', populate: { path: 'disciples' } });
            let thisReport = await Expected.findById(thisReportId).populate("disciples")
            let allReports = foundWorker.expected_attendance;
            
            let idsAllReports = allReports.map((elem) => {
                return elem._id;
            })
            // Look for position of thisReportId in that array
            let index = idsAllReports.indexOf(thisReportId);
            res.render("expected_attendance/expected_attendance_one", { thisReport, thisReportId, index });            
        } catch (error) {
            console.log(err);
        }
    },

    deleteReport: (req, res) => {
        thisReportId = req.params.id;
        Expected.findByIdAndRemove({ _id: thisReportId })
        .then((good) => {
            res.redirect("/expected")
            res.json(good);
        })
        .catch((err) => {
            console.log(err);
        })
    },

    removeDisciple: (req, res) => {
        thisReportId = req.params.id;
        Expected.findById(thisReportId)
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
        Expected.findById(thisReportId)
            .then((good) => {
                good.disciples.push(req.body._id);
                good.info = req.body.info;
                console.log(good)
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
        
        let newReport = await Expected.create(new Expected)
        try {
            newReport.disciples.push(req.body._id);
            newReport.save();
            res.json("added");
            Worker.findById(worker)
            .then((foundWorker) => {
                foundWorker.expected_attendance.push(newReport);
                foundWorker.save();
            })
            .catch((err) => {
                console.log(err);
            })
        } catch (error) {
            console.log(error)
        }
    },

    putReport: async (req, res) => {
        console.log(req.body);
        thisReportId = req.params.id;
        Expected.findById(thisReportId)
        .then((good) => {
            good.info = req.body.info;
            good.for = req.body.for;
            good.title = req.body.title;
            good.save();
            res.redirect("/expected");
        })
        .catch((err) => {
            req.flash("error", "There was a problem")
            console.log(err);
        })
    }
}