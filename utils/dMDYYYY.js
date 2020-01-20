

module.exports ={
    dMDYYYY: (fullDate) => {
        let month = fullDate.getMonth();
        let day = fullDate.getDay();
        let date = fullDate.getDate();
        let year = fullDate.getFullYear();
        let arrDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let arrMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let shortDate = `${arrDay[day]}, ${arrMonth[month]} ${date}, ${year}`;
        return shortDate;
    }
}