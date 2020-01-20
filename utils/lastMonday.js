
module.exports = {
        lastMondayfunction: (msDate) => {
        // let refSunday = 318600000; //Sun, 4th January 1970, 17:30:000;
        let refMonday = 318600000 + (13 * 1800 * 1000) + (3600 * 1000); //Mon, 5th January 1970, 01:00:000;
        let week = 604800000; // Number of milliseconds in a week;
        let timeAYear = 31536000000; // Number of milliseconds in a year;
        let diffTime = msDate - refMonday;
        let diffWeek = diffTime / week; //Difference in number of weeks;
        let msLastMonday = refMonday + (week * Math.floor(diffWeek));
        return msLastMonday;
    }
}
