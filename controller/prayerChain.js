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
    postPrayerReport: (req, res) => {
        let currentWorker = req.user.id;
        console.log(req.body);
        res.send("Post Prayer Chain Report");
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
