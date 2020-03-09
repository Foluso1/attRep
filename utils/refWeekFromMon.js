
const sixDaysAfter      =   require("./sixDaysAfter");
const lastMondayfunction = require("./lastMonday");

module.exports = {
    refWeekFromMonfunction: (msDate) => {
        let lastMonday = lastMondayfunction.lastMondayfunction(msDate)
        let a = new Date(lastMonday);
        let weekMonth = a.getMonth();
        let weekDate = a.getDate();
        let weekYear = a.getFullYear();
        let b = new Date(sixDaysAfter.sixDaysAfter(lastMonday));
        let plusWeekMonth = b.getMonth();
        let plusWeekYear = b.getFullYear();
        let plusWeekDate = b.getDate();
        let startWeek = `${weekDate}/${weekMonth + 1}/${weekYear} - ${plusWeekDate}/${plusWeekMonth + 1}/${plusWeekYear}`;
        return startWeek;
    }
}
