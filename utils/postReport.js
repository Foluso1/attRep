const       Disciple    = require("../models/disciple"),
            Worker      = require("../models/worker")
;

module.exports = async (req, res, report, userType, reportType)  => {
    let worker = {_id: req.user.id}; 
    // Special Meeting Check
    if(req.body.for.includes("Believer's") || req.body.for.includes("Charis")){
        const startOfYear = moment().startOf("year");
        let specialCheck = await report.find({
            [userType]: req.user.id,
            for: req.body.for,
            date: { $gte: startOfYear },
        });
        if(Array.isArray(specialCheck) && specialCheck.length > 0){
            req.flash("error", "Duplicate report detected, please edit previous report");
            return res.json("ERROR, Duplicate Report");                 
        }
    } else {
        let exp = await report.find({
            [userType]: req.user.id,
            for: req.body.for,
            date: { $gte: (Date.now() - (24*60*60*1000)) },
        }).populate("disciples");
        console.log(exp);
        if(Array.isArray(exp) && exp.length > 0){
            await report.find({
                [userType]: req.user.id,
                for: req.body.for,
                date: { $gte: (Date.now() - (24*60*60*1000)) },
            })
            req.flash("error", "Duplicate report detected, please edit previous report");
            return res.json("ERROR, Duplicate Report");
        }
    }
    const thisReport = {
        title: req.body.title,
        for: req.body.for,
        info: req.body.info,
        [userType]: req.user.id,
    };
    let newReport = await report.create(thisReport)
    console.log(newReport);
    newReportId = newReport._id;
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
    let foundWorker = await Worker.findById(worker);
    foundWorker[reportType].push(newReport);
    let savedWorker = await foundWorker.save();
    req.flash("success", "Successfully Reported");
    if (savedWorker) {
        return res.json("Done");
    }
}