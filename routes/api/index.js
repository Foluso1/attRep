const   express         =   require("express")
    ,   router          =   express.Router()
    ,   helper          =   require("./../../controller/api")
    ,   middleware      =   require("./../../middleware/index")
    ;

router.route("/workers").get(helper.workersDetails);
router.route("/prayerchain/:id/:weekNum").get(middleware.isLoggedIn, helper.getPrayerChainReportsforOne);
router.route("/prayerchain/:weekNum").get(middleware.isLoggedIn, helper.getAllPrayerChain);
router.route("/expected/:meetingName").get(middleware.isLoggedIn, helper.getAllSpecialMeetingsExpected);
router.route("/bc").get(middleware.isLoggedIn, helper.belCovDetails);
router.route("/attendance/:meetingName").get(middleware.isLoggedIn, helper.getAllSpecialMeetingsAttendance);

module.exports = router;