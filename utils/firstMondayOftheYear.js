module.exports = {
    firstMondayOftheYear: () => {
        let beginYear = new Date(new Date().getFullYear(), 0, 1); // January 1st of current year;
        let dayOftheWeek = beginYear.getDay()
        let firstMonday;
        if (dayOftheWeek !== 1) {
            //2
            let add = 7 - dayOftheWeek + 1;
            return firstMonday = (new Date(beginYear.getFullYear(), beginYear.getMonth(), (1 + add))).getTime();
        } else {
            return beginYear.getTime();
        }
    }
}