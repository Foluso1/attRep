const Worker        =   require("../models/worker")
    , PrayerChain   =   require("../models/prayer")
    ;




function lastSundayfunction(msDate) {
    let refSunday = 318600000; //Sun, 4th January 1970, 17:30:000;
    let week = 604800000; // Number of milliseconds in a week;
    let timeAYear = 31536000000; // Number of milliseconds in a year;
    let diffTime = msDate - refSunday;
    let diffWeek = diffTime / week; //Difference in number of weeks;
    let msLastSunday = refSunday + (week * Math.floor(diffWeek));
    return msLastSunday;
};

module.exports = {
    postPrayerReport: async (req, res) => {
        let currentWorker = req.user.id;
        console.log(req.body);
        //Jan 1, 2020
        refTimeMs = 1577833200;
        
        startString = req.body.starttime;
        let data = {
            start: req.body.starttime,
            end: req.body.endtime
        }
        let newPrayerChain = await PrayerChain.create(data);
        let foundWorker = await Worker.findById(currentWorker);
        foundWorker.prayerChainReport.push(newPrayerChain)
        foundWorker.save();
        res.json(newPrayerChain);
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
