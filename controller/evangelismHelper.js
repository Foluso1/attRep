const   Worker  =   require("../models/worker")
    ,   Disciple  =   require("../models/disciple")
    ,   Report  =   require("../models/report")
    ,   Evangelism  =   require("../models/evangelism")
    ,   flash = require("connect-flash")
    ,   moment      =   require("moment")
    ;



module.exports = {
    getReports: async (req, res) => {
        try {
            let worker = {
              _id: req.user.id
            };
            let foundWorker = await Worker.findById(worker).populate({
                path: "evangelism",
                options: { sort: { date: -1 } }
            });
            let theseEvangelismReports = foundWorker.evangelism;
            let evangelismReports = theseEvangelismReports.map((item)=>{
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
            res.render("evangelism/evangelism", { evangelismReports });
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem");
            res.redirect("/evangelism");
        }
    },

    newReport: async (req, res) => {
        try {
            res.render("evangelism/evangelismNew");
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem!");
            res.render("/report");
        }
    },
    
    postNewReport: async (req, res) => {
        try {
            
            // Check if user already has a similar report
            let data = JSON.stringify({
                  date: req.body.date,
                  location: req.body.location,
                  stats: req.body.evangelism,
                  details: req.body.details,
                  healing: req.body.healing,
                })
            let foundWorker =  await Worker.findById({ _id: req.user.id }).populate({ 
                path: "evangelism",
                options: {sort: {date: -1}, limit: 10}
            });
            let lastTenReports = foundWorker.evangelism;
            for(let i = 0; i < lastTenReports.length; i++){
                if(lastTenReports[i].data == data) {
                    req.flash("error", "Similar report exists");
                    return res.redirect("/evangelism");
                }
            }

            //Continue if no records match
            let obj = {
                    dateOnReport: new Date(req.body.date),
                    data
                }
                
            let evangelism = await Evangelism.create(obj);
            foundWorker.evangelism.push(evangelism);
            foundWorker.save();
            req.flash("success", "Your report has been submitted successfully. Thank you!");
            res.redirect("/evangelism");
        } catch (error) {
            console.log(error)
            req.flash("error", "Something went wrong");
            res.redirect("/report");
        }
    },

    deleteReport: async (req, res) => {
        try {
            evangelismId = req.params.id;
            foundEvangelism = await Evangelism.findOneAndRemove({ _id: evangelismId});
            req.flash("success", "Deleted successfully!");
            res.redirect("/evangelism");
        } catch (e) {
            console.log(e);
            req.flash("error", "There was a problem!");
            res.render("/report");
        }
    },

    editReportForm: async (req, res) => {
        try {
            let reportId = req.params.id;
            console.log(reportId);
            let foundReport = await Evangelism.findById({ _id: reportId });
            console.log(foundReport);
            let thisData = JSON.parse(foundReport.data);
            let thisReport = {
                dateOnReport: foundReport.dateOnReport,
                date: foundReport.date,
                data: thisData,
            }
            res.render("evangelism/evangelismEdit", {thisReport, reportId});
        } catch (e) {
            console.log(e)
            req.flash("error", "There was a problem");
            res.redirect("/report");
        }
    },

    updateReport: async (req, res) => {
        try {            
            let reportId = req.params.id;
            let obj = {
                dateOnReport: new Date(req.body.date),
                data: JSON.stringify({
                    date: req.body.date,
                    location: req.body.location,
                    stats: req.body.evangelism,
                    details: req.body.details,
                    healing: req.body.healing,
                }),
            };
            let thisReport = await Evangelism.findByIdAndUpdate({ _id: reportId }, obj, {new: true});
            req.flash("success", "Your edit was submitted successfully");
            res.redirect("/evangelism");
        } catch (e) {
            console.log(e)
            req.flash("error", "There was a problem");
            res.redirect("/evangelism");
        }
    },
}

