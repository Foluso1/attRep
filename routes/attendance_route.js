const    express         =   require("express")
    ,    router          =   express.Router()
    ,    helper          =   require("../controller/attendance_helper")
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
    .delete(middleware.isLoggedIn, helper.removeDisciple);

router.route("/:id")
    .get(middleware.isLoggedIn, helper.getOneReport)
    .delete(middleware.isLoggedIn, helper.deleteReport);

router.route("/:id/edit")
    .get(middleware.isLoggedIn, helper.editOneReport)
    .post(middleware.isLoggedIn, helper.addDisciple)
    .delete(middleware.isLoggedIn, helper.removeDisciple);

module.exports = router;