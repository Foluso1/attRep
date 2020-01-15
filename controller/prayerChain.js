const Worker        =   require("../models/worker")
    , PrayerChain   =   require("../models/prayerChain")
    ;


module.exports = {
    postPrayerReport: async (req, res) => {
        try {
            let currentWorker = req.user.id;
            console.log(req.body);
            //Jan 1, 2020
            let refTimeMs = 1577833200000  //Wed, 1st January 2020, 00:00:00;
            let nowMs = Date.now();
            let diffDateMs = nowMs - refTimeMs;
            let oneDayMs = 24 * 60 * 60 * 1000;
            let divider = Math.floor(diffDateMs / oneDayMs);
            // startString = req.body.starttime;

            
            let regExTime = /([0-9]?[0-9]):([0-9][0-9])/;
            let regExTimeArrStarttime = regExTime.exec(req.body.starttime);
            console.log(regExTimeArrStarttime);
            let regExTimeArrEndtime = regExTime.exec(req.body.endtime);
            let startHrMs = regExTimeArrStarttime[1] * 3600 * 1000;
            let startMnMs = regExTimeArrStarttime[2] * 60 * 1000;
            let endHrMs = regExTimeArrEndtime[1] * 3600 * 1000;
            let endMnMs = regExTimeArrEndtime[2] * 60 * 1000;
            console.log(startHrMs);
            console.log(startMnMs);
            console.log(endHrMs);
            console.log(endMnMs);
            let startTimeMs = new Date(refTimeMs + (divider * oneDayMs) + startHrMs + startMnMs);
            let endTimeMs = new Date(refTimeMs + (divider * oneDayMs) + endHrMs + endMnMs);
            console.log(startTimeMs);
            console.log(endTimeMs);
            

            let data = {
                start: startTimeMs,
                end: endTimeMs
            }
            let newPrayerChain = await PrayerChain.create(data);
            let foundWorker = await Worker.findById(currentWorker);
            foundWorker.prayerChainReport.push(newPrayerChain)
            foundWorker.save();
            res.json(newPrayerChain);
        } catch (err) {
            console.log(err);
        }
    },

    getPrayerReports: (req, res) => {
        currentWorker = req.user.id;
        res.render("prayerChain");
    },

    newPrayerReport: (req, res) => {
        let currentWorker = req.user.id;
       res.render("prayerChainNew");
    }

}
