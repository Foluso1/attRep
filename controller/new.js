const   Worker      =   require("../models/worker")
    ,   Disciple    =   require("../models/disciple")
    ,   Report      =   require("../models/discipleship_model")
    ,   flash       =   require("connect-flash")
    ,   Lockdown    =   require("../models/lockdown")
    ,   moment      =   require("moment")
    ;



module.exports = {
    getReports: async (req, res) => {
        try {
            let worker = {
              _id: req.user.id
            };
            let foundWorker = await Worker.findById(worker).populate({
                path: "lockdown",
                options: { sort: { date: -1 } }
            });
            let theseLockdownReports = foundWorker.lockdown;
            let lockdownReports = theseLockdownReports.map((item)=>{
                return thisOne = {
                    id: item.id,
                    firstname: item.firstname,
                    surname: item.surname,
                    date: item.date, //Time of report creation
                    dateOfReport: moment(item.dateOfReport).format('DD/MM/YYYY'),  //Time stated on report by user
                    data: JSON.parse(item.data)
                }
            });
            res.render("new/lockdown", { lockdownReports });
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem");
            res.redirect("/home");
        }
    },

    newReport: async (req, res) => {
        try {
            res.render("new/lockdownNew");
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem!");
            res.render("/discipleship");
        }
    },
    
    postNewReport: async (req, res) => {
        try {
            
            // Check if user already has a report for that date
            let dateOfReport = new Date(req.body.date)
            let startDateOfReport = moment(dateOfReport).startOf('day').valueOf();

            // Find reports in DB
            let foundWorker =  await Worker.findById({ _id: req.user.id }).populate("lockdown");
            let allLockdownReports = foundWorker.lockdown // Array;
            let reportCheck = false;

            // If array isn't empty
            if (allLockdownReports.length >= 1){
            reportCheck = allLockdownReports.reduce((acc, item) => {
                  if (startDateOfReport == moment(item.dateOfReport).startOf("day").valueOf()) {
                    return acc = true;
                  } else {
                    return acc = false;
                  }
                }, false);
            }
            if (reportCheck == true) {
              req.flash("error", "You have already reported for that day!");
              res.redirect("/new/lockdown");
            } else {
                let obj = {
                    dateOfReport: new Date(req.body.date),
                    data: JSON.stringify({
                      date: req.body.date,
                      exhortation: req.body.exhortation,
                      prayerChain: req.body["prayer-chain"],
                      discipleship: req.body["discipleship"],
                      evangelism: req.body.evangelism,
                      bibleStudy: [`${req.body["bible-study"][0]}:${req.body["bible-study"][1].toString().padStart(2, "0")}`, req.body["bible-study"][2]],
                      facebook: req.body.facebook,
                      studyGroup: req.body["study-group"],
                      telecast: req.body.telecast,
                      optional: req.body.optional,
                    }),
                  };
                let lockdown = await Lockdown.create(obj);
                foundWorker.lockdown.push(lockdown);
                foundWorker.save();
                req.flash("success", "Your report has been submitted successfully. Thank you!");
                res.redirect("/new/lockdown");
            }
        } catch (error) {
            console.log(error)
            req.flash("error", "Something went wrong");
            res.redirect("/register");
        }
    },

    delReport: async (req, res) => {
        try {
            lockdownId = req.params.id;
            foundLockdown = await Lockdown.findOneAndRemove({ _id: lockdownId});
            req.flash("success", "Deleted successfully!");
            res.redirect("/new/lockdown");
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem!");
            res.render("/discipleship");
        }
    },

    editReportForm: async (req, res) => {
        try {
            let reportId = req.params.id;
            let foundReport = await Lockdown.findById({ _id: reportId });
            let thisData = JSON.parse(foundReport.data);
            let regEx = /([0-9]*[0-9]):([0-9]*[0-9])/;
            let abc = regEx.exec(thisData.bibleStudy[0]);
            if (abc[2] <= 9) {
                abc[2] = abc[2].slice(1);
            }
            thisData.bibleStudy[0] = [abc[1], abc[2]]
            let thisReport = {
                dateOfReport: foundReport.dateOfReport,
                date: foundReport.date,
                data: thisData,
            }
            res.render("new/lockdownEdit", {thisReport, reportId});
        } catch (e) {
            console.log(e)
            req.flash("error", "There was a problem");
            res.redirect("/home");
        }
    },

    editReport: async (req, res) => {
        try {            
            let reportId = req.params.id;
            let obj = {
                dateOfReport: new Date(req.body.date),
                data: JSON.stringify({
                    date: req.body.date,
                    exhortation: req.body.exhortation,
                    prayerChain: req.body["prayer-chain"],
                    discipleship: req.body["discipleship"],
                    evangelism: req.body.evangelism,
                    bibleStudy: [`${req.body["bible-study"][0]}:${req.body["bible-study"][1].toString().padStart(2, "0")}`, req.body["bible-study"][2]],
                    facebook: req.body.facebook,
                    studyGroup: req.body["study-group"],
                    telecast: req.body.telecast,
                    optional: req.body.optional,
                }),
            };
            let thisReport = await Lockdown.findByIdAndUpdate({ _id: reportId }, obj, {new: true});
            req.flash("success", "Your edit was submitted successfully");
            res.redirect("/new/lockdown");
        } catch (e) {
            console.log(e)
            req.flash("error", "There was a problem");
            res.redirect("/new/lockdown");
        }
    },
}

