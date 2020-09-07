const       Worker      = require("../models/worker");
const       moment      = require("moment");

module.exports = async (dateForData, foundWorker, path) => {
        try {
            let workersUnder = foundWorker.workers;
            let startOfToday = 0;
            if (!dateForData) {
                startOfToday = moment().startOf('day').valueOf();
            } else {
                startOfToday = moment(dateForData).startOf("day").valueOf();
            }
            let manyArr = [];
            let noReportYet = [];
            let disciples = [];
            let noReportNames = "";
            let reportList = "";
            let totalAttendees = 0;
            for(let i = 0; i < workersUnder.length; i++) {
                if(workersUnder.length > 0 && workersUnder[i].expected_attendance.length > 0){
                    let isReportToday = false;
                    let thisWorker = await Worker.findById({ _id: workersUnder[i].id }).populate( {path: path, populate: { path: "disciples"}});
                    if (thisWorker.expected_attendance.length > 0) {
                        let expectedArr = thisWorker[path];
                        expectedArr.filter( (item) => {
                            let thisDay = moment(item.date).startOf("day").valueOf();
                            if (startOfToday == thisDay) {
                                isReportToday = true;
                                let abc = { 
                                    date: item.date,
                                    id: thisWorker.id,
                                    firstname: thisWorker.firstname,
                                    surname: thisWorker.surname,
                                    title: item.title, 
                                    for: item.for, 
                                    info: item.info, 
                                    disciples: disciples = item.disciples.map((each) => {
                                        return each.name;
                                    }),
                                    totalAttendees: totalAttendees = (totalAttendees + item.disciples.length),
                                }
                                manyArr.push(abc)
                                if (abc.info) {
                                    reportList = reportList + `${abc.firstname} ${abc.surname} \n\t ${abc.disciples.join("\n\t")} ${abc.info.split("\n").join("\n\t")}\n`;
                                } else {
                                    reportList = reportList + `${abc.firstname} ${abc.surname} \n\t ${abc.disciples.join("\n\t")}\n`;
                                }
                            } 
                        });
                        if(!isReportToday) {
                            let abc = {
                                id: thisWorker.id,
                                firstname: thisWorker.firstname,
                                surname: thisWorker.surname,
                            }
                            noReportYet.push(abc);
                            noReportNames = noReportNames + `${thisWorker.firstname} ${thisWorker.surname} \n`;
                        }
                    } else {
                        let abc = {
                            id: thisWorker.id,
                            firstname: thisWorker.firstname,
                            surname: thisWorker.surname,
                        }
                        noReportYet.push(abc);
                        noReportNames = noReportNames + `${thisWorker.firstname} ${thisWorker.surname} \n`;
                    }
                } else if (workersUnder[i]) {
                    let thisWorker = await Worker.findById({ _id: workersUnder[i].id });
                    let abc = {
                        id: thisWorker.id,
                        firstname: thisWorker.firstname,
                        surname: thisWorker.surname,
                    }
                    noReportYet.push(abc);
                    noReportNames = noReportNames + `${thisWorker.firstname} ${thisWorker.surname} \n`;
                }
            }
            manyArr.sort((a, b) => {
                return b.date.getTime() - a.date.getTime();
            });
            return { manyArr, startOfToday, noReportNames, totalAttendees, noReportYet, reportList }
        } catch (e) {
            console.log(e);
        }
    }