const       express     =   require("express")
        ,   router      =   express.Router()
        ,   Worker      =   require("../models/worker")
        ,   controller  =   require("../controller/lma")
        ,   middleware  =   require("../middleware")
        ,   moment      =   require("moment")

;


router
    .route("/")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getWorkers)
        .post(middleware.isLoggedIn, middleware.isLMA, controller.postWorker)
        .put(middleware.isLoggedIn, middleware.isLMA, controller.editWorker)
        .delete(middleware.isLoggedIn, middleware.isLMA, controller.removeWorker);
        
router
    .route("/special")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.special)

router
    .route("/all/reporttopastor")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getReportToPastor)
        // .post(middleware.isLoggedIn, middleware.isLMA, controller.reportToPastor)

router
    .route("/all/reporttopastor/:id/edit")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.editReportToPastor)

router
    .route("/all/reporttopastor/:id")
        .put(middleware.isLoggedIn, middleware.isLMA, controller.updateReportToPastor)
        
router
    .route("/all")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getAll);

router
    .route("/all/prayer")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllPrayerReports);

router
    .route("/all/attendance")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.chooseDateAttendance);

router
    .route("/all/attendance/:date")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllAttendanceWithDate);

router
    .route("/all/disciple")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllDisciples);

router
    .route("/all/prayerchain")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllPrayerChain);

router
    .route("/all/expected/")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.chooseDateExpected);

router
    .route("/all/expected/:date")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllExpectedAttendanceWithDate);

router
    .route("/all/evangelism/")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllEvangelism);

router
    .route("/expected/special")
        .get(middleware.isLoggedIn, controller.getAllExpectedSpecialMeetings);

router
    .route("/attendance/special")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllAttendanceSpecialMeetings);

router
    .route("/attendance/:date")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllAttendanceWithDate);


router
  .route("/lockdown")
  .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllLockdownWithDate);

router
    .route("/lockdown/:date")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getAllLockdownWithDate);

router
    .route("/new")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.addRemoveOrDelWorker);

router
    .route("/:id/profile")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getProfile)
        .post(middleware.isLoggedIn, middleware.isLMA, controller.postProfile);

router
    .route("/:id/prayer")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getPrayerReport);

router
    .route("/:id/disciple")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getDisciples);

router
    .route("/:id/disciple/:discId")
        .put(middleware.isLoggedIn, middleware.isLMA, controller.associateDisc);

router
    .route("/:id/discipleship")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getDiscipleshipReport);

router
    .route("/:id/evangelism")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getEvangelismReport);

router
    .route("/:id/attendance")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getAttendanceReport);

router
    .route("/:id/expected")
    .get(middleware.isLoggedIn, middleware.isLMA, controller.getExpectedReport);

router
    .route("/:id/prayerChain")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getPrayerChainReport)

router
    .route("/:id/lockdown")
        .get(middleware.isLoggedIn, middleware.isLMA, controller.getOneLockdown)

router
    .route("/:id")
        .delete(middleware.isLoggedIn, middleware.isLMA, controller.deleteWorker);


module.exports = router;
