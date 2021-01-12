const    express         =   require("express")
    ,    router          =   express.Router()
    ,    helper          =   require("../controller/evangelismHelper")
    ,    middleware      =   require("../middleware")
    ,    methodOverride  =   require("method-override")
    ,    flash           =   require("connect-flash")
    ;

router.use(express.urlencoded({ extended: true }));
router.use(flash());
router.use(methodOverride("_method"));


router.route("/")
    .get(middleware.isLoggedIn, middleware.emailCheck, middleware.signInWithGoogle, helper.getReports)
    .post(middleware.isLoggedIn, helper.postNewReport);

router.route("/new")
    .get(middleware.isLoggedIn, helper.newReport)

router.route("/:id")
    .put(middleware.isLoggedIn, helper.updateReport)
    .delete(middleware.isLoggedIn, helper.deleteReport);

router.route("/:id/edit")
    .get(middleware.isLoggedIn, helper.editReportForm)

router.route("/overview")
    .get(middleware.isLoggedIn, helper.evglsmOverview)

module.exports = router;