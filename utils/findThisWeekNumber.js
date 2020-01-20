    const lastMondayfunction = require("../utils/lastMonday")
    , firstMondayOftheYear  = require("../utils/firstMondayOftheYear")


module.exports = {
    findThisWeekNumber: (date) => {
    let week = 604800000; // Number of milliseconds in a week;

    //find lastMonday of date;
    //Get time of last Monday
    let lastMonday = lastMondayfunction.lastMondayfunction(date);

    //let abc = Subtract time of first Monday of the Year from last Monday.
    let diffMondays = lastMonday - firstMondayOftheYear.firstMondayOftheYear();

    //Divide abc by number of weeks and add 1 to it
    return Math.ceil((diffMondays / week) + 1);
}
}