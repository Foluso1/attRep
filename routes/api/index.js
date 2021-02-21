const   express         =   require("express")
    ,   router          =   express.Router()
    ,   helper          =   require("./../../controller/api")
    ,   middleware      =   require("./../../middleware/index")
    ;

router.route("/workers").get(middleware.isLoggedIn, helper.workersDetails);
router.route("/prayerchain/:id/:start/:end").get(middleware.isLoggedIn, helper.getPrayerChainReportsforOne);
router.route("/prayerchain/:weekNum").get(middleware.isLoggedIn, helper.getAllPrayerChain);
router.route("/expected/:meetingName").get(middleware.isLoggedIn, helper.getAllSpecialMeetingsExpected);
router.route("/expected/date/:date/for/:for/fellowship/:fellowship").get(middleware.isLoggedIn, helper.getAllExpectedAttendanceWithDate);
router.route("/bc").get(middleware.isLoggedIn, helper.belCovDetails);
router.route("/attendance/:meetingName").get(middleware.isLoggedIn, helper.getAllSpecialMeetingsAttendance);
router.route("/attendance/date/:date/for/:for/fellowship/:fellowship").get(middleware.isLoggedIn, helper.getAllAttendanceWithDate);
router.route("/attendance/cumulative/:meetingName").get(middleware.isLoggedIn, helper.getCumulativeAttendance);
// router.route("/evangelism/date/:date").get(middleware.isLoggedIn, helper.getAllEvangelismWithDate);
router.route("/evangelism/all/:fellowship/:start/:end").get(middleware.isLoggedIn, helper.getAllEvnglsmReports);
router.route("/evangelism/one/:id/:start/:end").get(middleware.isLoggedIn, helper.getOneEvnglsmReports);
router.route("/evangelism/:fellowship/:start/:end").get(middleware.isLoggedIn, helper.getAllEvangelismWithDate);
router.route("/evangelism/:start/:end").get(middleware.isLoggedIn, helper.getOneEvangelismWithDate);
router.route("/reporttopastor/:reportId/lma/:lmaId").get(middleware.isLoggedIn, helper.addOrRemoveLMA);
router.route("/gofix").get(middleware.isLoggedIn, helper.goFix);


module.exports = router;